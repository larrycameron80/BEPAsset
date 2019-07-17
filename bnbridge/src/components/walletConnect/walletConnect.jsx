import React, { Component } from 'react';
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  Link,
  Button,
  Grid
} from '@material-ui/core';

import {
  ERROR,
  REQUST_WALLET_CONNECT,
  RETURN_WALLET_URI,
  CLOSE_WALLET_CONNECT_MODAL
} from '../../constants';

import { colors } from '../../theme'

import scanIcon from '../../static/scan-qrcode.png';
import scanHoverIcon from '../../static/qrcode_hover.svg';

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    marginTop: '20px',
    marginBottom: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.black
  },
  description: {
    marginBottom: '30px'
  },
  buttonWrapper: {
    padding: '0.5rem 0'
  },
  instruction: {
    width: '95%',
    padding: '30px 40px',
    marginBottom: '0px',
    backgroundColor: colors.lightGray,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    '&>span': {
      '&>img:last-of-type': {
        display: 'none'
      }
    },
    '&:hover': {
      background: 'linear-gradient(90deg, rgb(251, 218, 60) 0%, rgb(239, 184, 11) 100%)',
      color: colors.white,
      '&>span': {
        '&>img:first-of-type': {
          display: 'none'
        },
        '&>img:last-of-type': {
          display: 'block'
        }
      }
    }
  },
  instructionContent: {
    fontWeight: 600,
    fontSize: '18px'
  },
  subDescription: {
    fontSize: '12px',
    marginTop: '5px'
  }
});

class WalletConnect extends Component {
  state = {
    loading: false,
    hover: false
  };

  componentWillMount() {
    emitter.on(ERROR, this.error);
    emitter.on(RETURN_WALLET_URI, this.showQRcode)
    emitter.on(CLOSE_WALLET_CONNECT_MODAL, this.closeQRcode)
  };

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.error);
    emitter.removeListener(RETURN_WALLET_URI, this.showQRcode)
    emitter.removeListener(CLOSE_WALLET_CONNECT_MODAL, this.closeQRcode)
  };

  error = (err) => {
    // this.props.showError(err)
    this.setState({ loading: false })
  };

  toggleHover =() => {
    this.setState({hover: !this.state.hover})
  };

  showQRcode = (uri) => {
    console.log(uri)
    WalletConnectQRCodeModal.open(uri, () => {
      console.log('QR code Modal closed!')
      this.setState({ loading: false })
    })
  };

  closeQRcode = () => {
    WalletConnectQRCodeModal.close()
  }

  walletConnect = () => {
    console.log('connectWallet')
    this.setState({ loading: true })
    if (!store.walletConnector.connected) {
      const content = {}
      dispatcher.dispatch({type: REQUST_WALLET_CONNECT, content })
    }
  };

  render() {
    const { classes } = this.props;
    const { hover } = this.state;

    return (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <Typography className={ classes.root }>
            WalletConnect(Recommended)
          </Typography>
          <Typography className={ classes.description }>
            Scan a QR code to link your mobile wallet usiing WalletConnect. Recommended Supported Wallets: Trust Wallet, CoolWallet S
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          <Button 
            className={ classes.instruction }
            onClick={ this.walletConnect }
            onMouseEnter={ this.toggleHover }
            onMouseOut={ this.toggleHover }
          >
            <span className={ classes.instructionContent }>Get WalletConnect QR Code</span>
            { <img src={ scanIcon } style={{ width: '50px' }} alt="Scan Icon" /> }
            { <img src={ scanHoverIcon } style={{ width: '50px' }} alt="Scan Icon" /> }
          </Button>
          <p className={ classes.subDescription }>
            Don't have an app that supports WalletConnect yet? Get Trust Wallet >>
          </p>
        </Grid>
        <Grid item container xs={12} 
          alignContent="space-between"
          style={{ marginTop: '20px' }}>
          <Grid item xs={ 12 } className={ classes.buttonWrapper }>
            <Link
              component={RouterLink}
              to="/create"
            >Create a New Wallet
            </Link>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  };
}

WalletConnect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WalletConnect);