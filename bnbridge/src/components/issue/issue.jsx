import React, { Component } from "react";
import PropTypes from "prop-types";
import { crypto } from '@binance-chain/javascript-sdk';
import { Link as RouterLink, withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Link,
  Typography
} from "@material-ui/core"

import Checkbox from "../common/checkbox";
import Input from "../common/input";
import Button from "../common/button";
import Dialog from "../common/dialog";
import PageLoader from "../common/pageLoader";

import { colors } from '../../theme'

import {
  ERROR,
  FINALIZE_TOKEN,
  TOKEN_FINALIZED,
  WALLET_UPDATED
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


class Issue extends Component {
  state = {
    page: 0,
    loading: false,
    tokenName: '',
    tokenNameError: false,
    symbol: '',
    symbolError: false,
    totalSupply: '',
    totalSupplyError: false,
    mintable: false,
    mintableError: false,
    wallet: null,
    hash: null,
    tokenData: null,
    issueError: null,
    dialogOpen: false
  };

  componentWillMount() {
    console.log(store.getStore('wallet'))
    this.setState({
      wallet: store.getStore('wallet')
    })
    emitter.on(TOKEN_FINALIZED, this.tokenFinalized);
    emitter.on(WALLET_UPDATED, this.getWallet);
    emitter.on(ERROR, this.error);
  };

  componentWillUnmount() {
    emitter.removeListener(TOKEN_FINALIZED, this.tokenFinalized);
    emitter.removeListener(WALLET_UPDATED, this.removeWallet);
    emitter.on(ERROR, this.error);
  };

  error = (err) => {
    this.props.showError(err)

    this.setState({ loading: false })
  };

  tokenFinalized = (data) => {
    this.setState({
      page: 2,
      loading: false
    })
  };

  getWallet = (data) => {
    console.log('wallet : ', data)
    this.setState({
      wallet: data
    })
  };

  removeWallet = () => {
    this.setState({
      wallet: null
    })
  };

  confirmPassword = () => {
    this.setState({ dialogOpen: true })
  };

  callIssueToken = async (password) => {
    if (!password) {
      return;
    }

    this.setState({ loading: true, dialogOpen: false })

    const {
      tokenName,
      symbol,
      totalSupply,
      mintable
    } = this.state

    try {
      const wallet = store.getStore('wallet');
      const privateKey = crypto.getPrivateKeyFromKeyStore(wallet.keystore, password)

      await store.setPrivateKey(privateKey)
      const newToken = await store.bncClient.tokens.issue(wallet.address, tokenName, symbol, totalSupply, mintable)
      console.log('newToken: ', newToken.result)
      console.log('newToken: ', newToken.result[0])
      console.log('newToken: ', newToken.result[0].hash)

      if (newToken.status === 200) {
        this.setState({
          page: 1,
          loading: false,
          hash: newToken.result[0].hash,
          tokenData: JSON.parse(newToken.result[0].data)
        })
      }
    } catch (e) {
      console.log(e)
      this.setState({
        loading: false,
        issueError: "Error: " + e.message.replace('50000000000BNB', '500BNB')
      })
    }
    this.setState({
      loading: false
    })
  };

  callFinalizeToken = () => {
    const {
      issueUuid
    } = this.state

    const content = {
      uuid: issueUuid
    }
    dispatcher.dispatch({type: FINALIZE_TOKEN, content })

    this.setState({ loading: true })
  };

  validateIssueToken = () => {
    this.setState({
      tokenNameError: false,
      symbolError: false,
      totalSupplyError: false,
    })

    const {
      tokenName,
      symbol,
      totalSupply
    } = this.state

    let error = false

    if(!tokenName || tokenName === '') {
      this.setState({ tokenNameError: true })
      error = true
    }
    if(!symbol || symbol === '') {
      this.setState({ symbolError: true })
      error = true
    }
    if(!totalSupply || totalSupply === '') {
      this.setState({ totalSupplyError: true })
      error = true
    }

    return !error
  };

  onNext = (event) => {
    switch (this.state.page) {
      case 0:
        if(this.validateIssueToken()) {
          this.confirmPassword()
        }
        break;
      case 1:
        this.callFinalizeToken()
        break;
      case 2:
        this.props.onBack()
        break;
      default:

    }
  };

  onBack = (event) => {
    this.setState({ page: 0 })
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  };

  onSelectChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  }

  renderPage0() {
    const {
      tokenName,
      tokenNameError,
      symbol,
      symbolError,
      totalSupply,
      totalSupplyError,
      mintable,
      mintableError,
      loading,
      issueError,
      dialogOpen
    } = this.state

    return (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <Input
            id="tokenName"
            fullWidth={ true }
            label="Token Name"
            placeholder="eg: Binance Coin"
            value={ tokenName }
            error={ tokenNameError }
            onChange={ this.onChange }
            disabled={ loading }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="symbol"
            fullWidth={ true }
            label="Symbol"
            placeholder="eg: BNB"
            value={ symbol }
            error={ symbolError }
            onChange={ this.onChange }
            disabled={ loading }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="totalSupply"
            fullWidth={ true }
            label="Total Supply"
            placeholder="eg: 10000000000000000"
            value={ totalSupply }
            error={ totalSupplyError }
            onChange={ this.onChange }
            disabled={ loading }
          />
        </Grid>
        <Grid item xs={ 12 }>
          <Checkbox
            id="mintable"
            fullWidth={ true }
            label="Mintable"
            value={ mintable }
            error={ mintableError }
            onChange={ this.onSelectChange }
            disabled={ loading }
          />
        </Grid>
        <Typography style={{ color: colors.red }}>{ issueError }</Typography>
        <Dialog
          open={ dialogOpen }
          onCancel={ () => this.setState({dialogOpen: false}) }
          onClick={ this.callIssueToken }
        >
        </Dialog>
      </React.Fragment>
    )
  };

  renderPage1 = () => {
    const {
      classes
    } = this.props

    const {
      hash,
      tokenData
    } = this.state

    return (
      <React.Fragment>
        <Grid item xs={ 12 } className={ classes.frame }>
          <Typography className={ classes.instructionBold }>
            Awesome
          </Typography>
          <Typography className={ classes.instructions }>
            Your transaction was successfull. You should find it in the token list.
          </Typography>
          <Typography className={ classes.instructions }>
            Your transaction hash : <Link
              component={RouterLink}
              to={`${config.explorerURL}${hash}`}
            >
              { hash }
            </Link>
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <Typography className={ classes.instructions }>
              Token Name: { tokenData.name }
            </Typography>
            <Typography className={ classes.instructions }>
              Symbol: { tokenData.symbol }
            </Typography>
            <Typography className={ classes.instructions }>
              Origin Symbol: { tokenData.original_symbol }
            </Typography>
            <Typography className={ classes.instructions }>
              Total Supply: { tokenData.total_supply }
            </Typography>
            <Typography className={ classes.instructions }>
              Minterble: { tokenData.mintable ? "Yes" : "No" }
            </Typography>
            <Typography className={ classes.instructions }>
              Owner: { tokenData.owner }
            </Typography>
           </div>
        </Grid>
      </React.Fragment>
    )
  };

  render() {
    const {
      classes,
      onBack
    } = this.props

    const {
      page,
      loading
    } = this.state

    return (
      <Grid container className={ classes.root }>
        { loading && <PageLoader /> }
        { page === 0 && this.renderPage0() }
        { page === 1 && this.renderPage1() }
        { page > 0 &&
        <Grid item xs={ 6 } className={ classes.button }>
          <Button
            disabled={ loading }
            label="OK"
            onClick={ page === 0 ? onBack : this.onBack }
          />
        </Grid>}
        <Grid item xs={ page > 0 ? 6 : 12 } align="right" className={ classes.button }>
          <Button
            disabled={ loading }
            fullWidth={true}
            label="Next"
            onClick={ this.onNext }
          />
        </Grid>
      </Grid>
    )
  }
}

Issue.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Issue);
