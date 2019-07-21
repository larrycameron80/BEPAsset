import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid
} from '@material-ui/core';
import { colors } from '../../theme'

import {
  ERROR,
  FEES_UPDATED,
  WALLET_UPDATED,
  WALLET_CONNECT_CONNECTED,
  WALLET_CONNECT_DISCONNECTED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    maxWidth: '400px',
    margin: 'auto 38px',
    ['@media (max-width: 500px)']: {
      maxWidth: '300px',
      margin: 'auto 10px',
    },
    ['@media (max-width: 320px)']: {
      maxWidth: '260px',
      margin: 'auto 10px',
    }
  },
  itemWrapper: {
    marginTop: '40px',
    marginBottom: '24px'
  },
  header: {
    fontSize: '2.4rem',
    color: colors.black,
    marginBottom: '24px',
    fontWeight: 400,
    fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
  },
  action: {
    fontSize: '1rem',
    color: colors.black,
    display: 'inline-block',
    marginBottom: "0.7rem"
  },
  actionRed: {
    fontSize: '1rem',
    color: colors.black,
    display: 'inline-block',
    marginTop: "0.5rem",
    fontWeight: 'bold'
  },
  price: {
    paddingRight: '0px',
    fontSize: '1rem',
    color: colors.black,
    display: 'inline-block',
    marginBottom: "0.7rem"
  }
});

class Instructions extends Component {
  state = {
    fees: [],
    address: '',
    balance: 0
  };

  componentWillMount() {
    this.updateAddressAndBalance();
    emitter.on(ERROR, this.error);
    emitter.on(FEES_UPDATED, this.feesUpdated);
    emitter.on(WALLET_UPDATED, this.walletUpdated);
    emitter.on(WALLET_CONNECT_CONNECTED, this.walletConnected);
    emitter.on(WALLET_CONNECT_DISCONNECTED, this.walletDisconnected);
  };

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.error);
    emitter.removeListener(FEES_UPDATED, this.feesUpdated);
    emitter.removeListener(WALLET_UPDATED, this.walletUpdated);
    emitter.removeListener(WALLET_CONNECT_CONNECTED, this.walletConnected);
    emitter.removeListener(WALLET_CONNECT_DISCONNECTED, this.walletDisconnected);
  };

  error = (err) => {
    // this.props.showError(err)
    this.setState({ loading: false })
  };

  updateAddressAndBalance = () => {
    const wallet = store.getStore('wallet');
    console.log(wallet)
    if (wallet && wallet.address) {
      store.getAddressBalances(wallet.address)
        .then((balances) => {
          const bnbBalance = balances.find((assetBalance) => {
            return 'BNB' === assetBalance.symbol ? true : false
          })

          this.setState({
            address: wallet.address,
            balance: bnbBalance ? bnbBalance.free : 0
          })
        })
    } else {
      this.props.history.push('/')
    }
  };

  walletConnected = (content) => {
    this.setState({
      address: content.account[0]
    })
    this.updateAddressAndBalance()
  };

  walletDisconnected = () => {
    this.props.history.push('/')
  };

  feesUpdated = () => {
    const fees = store.getStore('fees')

    let feesDisplay = fees.map((fee) => {
      let description = ""

      switch (fee.msg_type) {
        case 'submit_proposal':
          description = 'Submit Listing Proposal'
          break;
        case 'dexList':
          description = 'Listing On DEX'
          break;
        case 'issueMsg':
          description = 'Issue New Token'
          break;
        case 'send':
          description = 'Transfer Tokens'
          break;
        case 'list_proposal_deposit':
          description = 'Listing Proposal Deposit'
          break;
        default:
          break;
      }

      return {
        description: description,
        price: fee.fee/100000000
      }
    })

    this.setState({
      fees,
      feesDisplay: feesDisplay,
    })
  };

  walletUpdated = (content) => {
    this.updateAddressAndBalance()
  };

  render() {
    const {
      classes
    } = this.props;

    const {
      address,
      balance
    } = this.state;

    return (
      <Grid
        className={ classes.root }
        container
        justify="flex-start"
        alignItems="flex-end">
        <Grid item xs={12} align='left'>
          <div className={ classes.itemWrapper } >
            <Typography className={ classes.header }>With bnbridge you can:</Typography>
            <div style={{marginBottom: 15}}><Typography className={ classes.action }>Launch BEP2 assets</Typography></div>
            <div style={{marginBottom: 15}}><Typography className={ classes.action }>List tokens on Binance DEX</Typography></div>
          </div>
          <div className={ classes.itemWrapper } >
            <Typography className={ classes.header }>Bnbridge fees:</Typography>
              <Grid
                container
                justify="flex-start"
                alignItems="flex-end">
                <Grid item xs={2} sm={2} align='left' className={ classes.action }>
                  Address
                </Grid>
                <Grid item xs={12} sm={10} align='right' className={ classes.price }>
                  { address }
                </Grid>
                <Grid item xs={6} align='left' className={ classes.action }>
                  Balance
                </Grid>
                <Grid item xs={6} align='right' className={ classes.price }>
                  { balance } BNB
                </Grid>
            </Grid>
            <Grid
                container
                justify="flex-start"
                alignItems="flex-end">
                { this.renderFees() }
            </Grid>
          </div>
        </Grid>
      </Grid>
    )
  };

  renderFees = () => {
    const {
      classes
    } = this.props;

    if(!this.state.feesDisplay) {
      return null
    }

    return this.state.feesDisplay.map((fee) => {
      return (
        <React.Fragment key={fee.description}>
          <Grid item xs={6} align='left' className={ classes.action }>
            {fee.description}
          </Grid>
          <Grid item xs={6} align='right' className={ classes.price }>
            {fee.price} BNB
          </Grid>
        </React.Fragment>
      )
    })
  }
}

Instructions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Instructions));
