import React, { Component } from "react";
import PropTypes from "prop-types";
import { crypto } from '@binance-chain/javascript-sdk';
import { Link as RouterLink, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Link,
  Typography
} from "@material-ui/core"

import Input from "../common/input";
import Button from "../common/button";
import Dialog from "../common/dialog";
import PageLoader from "../common/pageLoader";

import { colors } from '../../theme'

import {
  ERROR,
  FEES_UPDATED,
  GET_LIST_PROPOSAL,
  LIST_PROPOSAL_UPDATED
} from '../../constants'

import config from "../../config";
import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    width: "400px",
    ['@media (max-width: 500px)']: {
      width: "300px"
    },
    ['@media (max-width: 320px)']: {
      width: "280px"
    }
  },
  button: {
    marginTop: "24px"
  },
  disclaimer: {
    fontSize: '12px',
    marginTop: '24px'
  },
  heading: {
    fontSize: '0.8125rem',
    fontFamily: 'Roboto,sans-serif',
    fontWeight: '500',
    lineHeight: '1.75',
    flexShrink: 0,
    whiteSpace: 'normal',
    textTransform: 'uppercase',
    marginTop: '38px',
    marginBottom: '14px',
    paddingBottom: '10px',
    textAlign: 'center',
    width: '200px',
    borderBottom: '2px solid '+colors.yellow
  },
  frame: {
    border: '1px solid #e1e1e1',
    borderRadius: '3px',
    backgroundColor: '#fafafa',
    padding: '1rem'
  },
  instructions: {
    fontSize: '0.8rem',
    textAlign: 'center',
    marginBottom: '16px'
  },
  instructionUnderlined: {
    fontSize: '0.8rem',
    textDecoration: 'underline',
    textAlign: 'center',
    marginBottom: '16px'
  },
  instructionBold: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px'
  },
});


class List extends Component {
  state = {
    page: 'SubmitProposal0',
    loading: false,

    symbol: '',
    symbolError: false,

    expiryTime: '',
    expiryTimeError: false,
    votingPeriod: '',
    votingPeriodError: false,
    initialPrice: '',
    initialPriceError: false,

    listProposalFee: store.getStore('fees')?store.getStore('fees').filter((fee) => {
      return fee.msg_type === 'submit_proposal'
    }).map((fee) => {
      return fee.fee/100000000
    })[0]:0,
    depositFee: 2000,

    wallet: null,
    dialogOpen: false,
    listError: null,
    txhash: '',
    proposalId: null,
    proposalStatus: null
  };

  componentWillMount() {
    this.setState({
      wallet: store.getStore('wallet')
    })
    emitter.on(ERROR, this.error);
    emitter.on(FEES_UPDATED, this.feesUpdated);
    emitter.on(LIST_PROPOSAL_UPDATED, this.listProposalUpdated);
  };

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.error);
    emitter.removeListener(FEES_UPDATED, this.feesUpdated);
    emitter.removeListener(LIST_PROPOSAL_UPDATED, this.listProposalUpdated);
  };

  confirmPassword = () => {
    this.setState({ dialogOpen: true })
  };

  feesUpdated = () => {
    const fees = store.getStore('fees')

    let listProposalFee = fees.filter((fee) => {
      return fee.msg_type === 'submit_proposal'
    }).map((fee) => {
      return fee.fee/100000000
    })[0]

    let listFee = fees.filter((fee) => {
      return fee.msg_type === 'dexList'
    }).map((fee) => {
      return fee.fee/100000000
    })[0]

    this.setState({
      listProposalFee: listProposalFee,
      listFee: listFee
    })
  };

  error = async (err) => {
    this.setState({ loading: false })
    this.props.showError(err)
  };

  callSubmitListProposal = async (password) => {
    if (!password) {
      return
    }

    this.setState({ loading: true, dialogOpen: false })

    const {
      symbol,
      expiryTime,
      votingPeriod,
      initialPrice,
      wallet,
    } = this.state

    const date = new Date()
    const address = wallet.address
    const expireTime = date.setHours(date.getHours() + expiryTime * 24);
    console.log('votingPeriodTime : ', expireTime, config.initialDepositAmount, votingPeriod * 86400)

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(wallet.keystore, password)
      await store.setPrivateKey(privateKey)

      const params = {
        title: `List ${symbol}`,
        description: `List ${symbol}`,
        baseAsset: symbol,
        quoteAsset: "BNB",
        initPrice: initialPrice,
        address,
        initialDeposit: config.initialDepositAmount,
        expireTime: expireTime,
        votingPeriod: votingPeriod * 86400
      }

      const list = await store.bncClient.gov.submitListProposal(params)
      console.log('list result : ', list)
      console.log('1 : ', list.result[0])

      if (list.status === 200) {
        this.setState({
          page: 'SubmitProposal2',
          loading: false,
          hash: list.result[0].hash,
          proposalId: JSON.parse(list.result[0].data)
        })
      }
    } catch (e) {
      console.log(e)
      console.log(e.message)
      this.setState({
        loading: false,
        listError: "Error: " + e.message
      })
    }

    this.setState({ loading: false })
  };

  callValidateSubmitProposal = async () => {
    this.setState({ loading: true })
    const {
      symbol,
      wallet,
    } = this.state

    try {
      const balances = await store.getAddressBalances(wallet.address)
      const bnbBalance = balances.find((assetBalance) => {
        return 'BNB' === assetBalance.symbol ? true : false
      })
      
      const fees = store.getStore('fees')
      let totalListingFee = fees.reduce((total, fee) => {
        const feeValue = fee.msg_type !== 'issueMsg' ? fee.fee / 1e8 : 0
        return total + feeValue
      }, 0)
      
      if (Number(bnbBalance.free) < totalListingFee) {
        this.setState({
          loading: false,
          listError: 'Insufficient BNB balance for listing'
        })
        return
      }

      const market = await store.getTokenMarket(symbol)
      if (market) {
        this.setState({
          loading: false,
          listError: `${symbol} already listed token on DEX`
        })
        return
      }

      const tokenInfo = await store.getTokenInfo(symbol)
      if (!tokenInfo) {
        this.setState({
          loading: false,
          listError: `Does not exist this token ${symbol} in the chain`
        })
        return
      }
      
      this.setState({
        listError: null,
        loading: false,
        page: 'SubmitProposal1'
      })

      return
    } catch (e) {
      console.log(e)
      this.setState({
        listError: "Error: " + e.message
      })
    }
    this.setState({ loading: false })
  };

  callFinalizeListProposal = () => {
    this.confirmPassword()
  };

  validateListProposal = () => {
    this.setState({
      symbolError: false,
      expiryTimeError: false,
      votingPeriodError: false,
      initialPriceError: false,
      listError: false
    })

    const {
      symbol,
      expiryTime,
      votingPeriod,
      initialPrice
    } = this.state

    let error = false

    if(!symbol || symbol === '') {
      this.setState({ symbolError: true })
      error = true
    }
    if(!votingPeriod || votingPeriod === '') {
      this.setState({ votingPeriodError: true })
      error = true
    }
    if(!expiryTime || expiryTime === '') {
      this.setState({ expiryTimeError: true })
      error = true
    }
    if(!initialPrice || initialPrice === '') {
      this.setState({ initialPriceError: true })
      error = true
    }

    return !error
  };

  getListProposal = () => {
    this.setState({
      symbolError: false,
      expiryTimeError: false,
      votingPeriodError: false,
      initialPriceError: false,
      listError: false
    })

    const {
      symbol,
      wallet
    } = this.state

    if(!symbol || symbol === '') {
      this.setState({ symbolError: true })
      return false
    }

    this.setState({ loading: true })

    const content = {
      address: wallet.address,
      symbol
    }

    dispatcher.dispatch({type: GET_LIST_PROPOSAL, content })
  };

  listProposalUpdated = async (data) => {
    console.log('listProposalUpdated: ', data)
    if (data && data.value && data.value.proposal_id > 0) {
      this.setState({
        loading: false,
        page: 'GettingList',
        proposalId: data.value.proposal_id,
        proposalStatus: data.value
      })

      return
    } else {
      this.setState({ loading: false })
      if(this.validateListProposal()) {
        await this.callValidateSubmitProposal()
      }
    }
  };

  callList = async (password) => {
    this.setState({ loading: true })
    const {
      wallet,
      proposalId,
      proposalStatus
    } = this.state

    try {
      await store.bncClient.list(wallet.address, proposalId, proposalStatus.base_asset_symbol, proposalStatus.quote_asset_symbol, proposalStatus.description.initPrice / 1e8)

      this.setState({
        page: 'Listed'
      })
    } catch (e) {
      console.log('listing error : ', e)
    }

    this.setState({ loading: false })
  }

  requirePassword = async (password) => {
    switch (this.state.page) {
      case 'SubmitProposal1':
        await this.callSubmitListProposal(password)
        break;
      case 'GettingList':
        await this.callList(password)
        break;
      default:
    }
  }

  onNext = async (event) => {
    console.log(this.state.page)
    switch (this.state.page) {
      case 'SubmitProposal0':
        await this.getListProposal()
        break;
      case 'SubmitProposal1':
        this.callFinalizeListProposal()
        break;
      case 'SubmitProposal2':
        this.resetPage()
        break;
      case 'GettingList':
        await this.callList()
        break;
      default:
    }
  };

  resetPage = () => {
    this.setState({
      page: 'SubmitProposal0',
      symbol: '',
      symbolError: false,
      expiryTime: '',
      expiryTimeError: false,
      votingPeriod: '',
      votingPeriodError: false,
      initialPrice: '',
      initialPriceError: false,
      listError: false,
      loading: false,
    })
  };

  onBack = (event) => {
    this.setState({ page: 'SubmitProposal0' })
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
    this.setState({
      listError: null
    })
  };

  renderSubmitProposal0 = () => {
    const {
      symbol,
      symbolError,
      expiryTime,
      expiryTimeError,
      votingPeriod,
      votingPeriodError,
      initialPrice,
      initialPriceError
    } = this.state

    return (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <Input
            id="symbol"
            fullWidth={ true }
            label="TokenSymbol"
            placeholder="ex: SPNDB-916"
            value={ symbol }
            error={ symbolError }
            onChange={ this.onChange }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="expiryTime"
            fullWidth={ true }
            label="Expiry Time"
            placeholder="eg: 15 (days)"
            value={ expiryTime }
            error={ expiryTimeError }
            onChange={ this.onChange }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="votingPeriod"
            fullWidth={ true }
            label="Voting Period"
            placeholder="eg: 7 (days)"
            value={ votingPeriod }
            error={ votingPeriodError }
            onChange={ this.onChange }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="initialPrice"
            fullWidth={ true }
            label="Initial Price"
            placeholder="eg: 1"
            value={ initialPrice }
            error={ initialPriceError }
            onChange={ this.onChange }
          />
        </Grid>
      </React.Fragment>
    )
  };

  renderSubmitProposal1 = () => {
    const {
      symbol,
      expiryTime,
      votingPeriod,
      initialPrice,
      listProposalFee,
      depositFee
    } = this.state

    const {
      classes
    } = this.props

    return (
      <React.Fragment>
        <Grid item xs={ 12 } className={ classes.frame }>
        <Typography className={ classes.instructionUnderlined }>
            Here's what you need to do confirm:
          </Typography>
          <Typography className={ classes.instructionBold }>
            Listing Fees : {listProposalFee + depositFee} BNB
          </Typography>
          <Typography className={ classes.instructionBold }>
            Token Symbol : {symbol}
          </Typography>
          <Typography className={ classes.instructionBold }>
            Expiry Time : {expiryTime} Days
          </Typography>
          <Typography className={ classes.instructionBold }>
            Voting Period : {votingPeriod} Days
          </Typography>
          <Typography className={ classes.instructionBold }>
            Initial Price : {initialPrice} BNB
          </Typography>
          <Typography className={ classes.instructionUnderlined }>
            After you've confirmed, click the "NEXT" button.
          </Typography>
        </Grid>
      </React.Fragment>
    )
  };

  renderSubmitProposal2 = () => {
    const {
      classes
    } = this.props

    const {
      txhash,
      proposalId
    } = this.state

    return (
      <React.Fragment>
        <Grid item xs={ 12 } className={ classes.frame }>
          <Typography className={ classes.instructionBold }>
            Awesome
          </Typography>
          <Typography className={ classes.instructions }>
            Your transaction was successfull.
          </Typography>
          <Typography className={ classes.instructions }>
            Your transaction hash : <Link
              component={RouterLink}
              to={`${config.explorerURL}${txhash}`}
            >
              { txhash }
            </Link>
          </Typography>
          <Typography className={ classes.instructionBold }>
            Your Proposal ID : { proposalId }
          </Typography>
          <Typography className={ classes.instructions }>
            The next steps require Binance validators to vote on whether they want the token listed on the DEX. Once 50% of the validators vote "Yes", you will need to submit the list transaction.
          </Typography>
          <Typography className={ classes.instructions }>
            You will be able to do so by using this utility.
          </Typography>
        </Grid>
      </React.Fragment>
    )
  };

  renderListed = () => {
    const {
      classes
    } = this.props

    const {
      symbol
    } = this.state

    return (
      <React.Fragment>
        <Grid item xs={ 12 } className={ classes.frame }>
          <Typography className={ classes.instructionBold }>
            Token Listed
          </Typography>
          <Typography className={ classes.instructionBold }>
            This token {symbol} listed on Binance DEX.
          </Typography>
          <Typography className={ classes.instructions }>
            You should be able to interact with it on the exchange.
          </Typography>
        </Grid>
      </React.Fragment>)
  };

  renderGettingList = () => {
    const {
      classes
    } = this.props

    const {
      proposalId,
      proposalStatus
    } = this.state

    const proposalDescription = JSON.parse(proposalStatus.description)
    const totalDeposit = proposalStatus.total_deposit.reduce((total, deposit) => {
      return total + Number(deposit.amount)
    }, 0)

    return (
      <Grid item xs={ 12 } className={ classes.frame }>
        <Typography className={ classes.instructionBold }>
          Getting Proposal Status
        </Typography>
        <Typography className={ classes.instructions }>
          This token has a previous token listing proposal submitted to Binance.
        </Typography>
        <Typography className={ classes.instructionBold }>
          Proposal ID : { proposalId }
        </Typography>
        <Typography className={ classes.instructionBold }>
          Trading Pair : { proposalDescription.base_asset_symbol } / {proposalDescription.quote_asset_symbol}
        </Typography>
        <Typography className={ classes.instructionBold } style={{ color: proposalStatus.proposal_status === 'Passed' ? colors.blue : colors.red }}>
          Proposal Status : { proposalStatus.proposal_status }
        </Typography>
        <Typography className={ classes.instructionBold }>
          Proposal Type : { proposalStatus.proposal_type }
        </Typography>
        <Typography className={ classes.instructionBold }>
          Submit Time : { proposalStatus.submit_time }
        </Typography>
        <Typography className={ classes.instructionBold }>
          Total Deposit : { totalDeposit / 1e8 } BNB
        </Typography>
        <Typography className={ classes.instructionBold }>
          Voting Period : { proposalStatus.voting_period / 86400000 } Days
        </Typography>
        <Typography className={ classes.instructionBold }>
          Voting Start Time : { proposalStatus.voting_start_time }
        </Typography>
      </Grid>)
  };

  render() {
    const {
      classes
    } = this.props

    const {
      page,
      loading,
      dialogOpen,
      listError,
      proposalStatus
    } = this.state

    return (
      <Grid container className={ classes.root }>
        { loading && <PageLoader /> }
        { page === 'SubmitProposal0' && this.renderSubmitProposal0() }
        { page === 'SubmitProposal1' && this.renderSubmitProposal1() }
        { page === 'SubmitProposal2' && this.renderSubmitProposal2() }
        { page === 'Listed' && this.renderListed() }
        { page === 'GettingList' &&  this.renderGettingList() }
        { listError && <Typography style={{ color: colors.red }}>{ listError }</Typography> }
        { !(['SubmitProposal0'].includes(page)) &&
          <Grid item xs={ proposalStatus && proposalStatus.proposal_status === 'Passed' ? 6 : 12 } align='left' className={ classes.button }>
            <Button
              disabled={ loading }
              label="Back"
              fullWidth={ true }
              onClick={ this.onBack }
            />
          </Grid>
        }
        {
          (!(['GettingList', 'Listed' ].includes(page)) || (page === 'GettingList' && proposalStatus.proposal_status === 'Passed')) &&
          <Grid item xs={ !(page === 'SubmitProposal0') ? 6 : 12 } align="right" className={ classes.button }>
            <Button
              disabled={ loading }
              fullWidth={true}
              label="Next"
              onClick={ this.onNext }
            />
          </Grid>
        }
        <Dialog
          open={ dialogOpen }
          onCancel={ () => this.setState({dialogOpen: false}) }
          onClick={ this.requirePassword }
        >
        </Dialog>
      </Grid>
    )
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(List);
