import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  Link,
  Grid
} from '@material-ui/core';

import { colors } from '../../theme'

import scanIcon from '../../static/scan-qrcode.png';

import Store from "../../stores";
// const dispatcher = Store.dispatcher
// const emitter = Store.emitter
// const store = Store.store

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
    width: '100%',
    padding: '30px 40px',
    marginBottom: '0px',
    background: colors.lightGray,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between'
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
    loading: false
  };

  unlockWalletWithLedger = () => {

  };

  render() {
    const { classes } = this.props;

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
          <div className={ classes.instruction }>
            <span className={ classes.instructionContent }>Get WalletConnect QR Code</span>
            <img src={ scanIcon } alt="Scan Icon" />
          </div>
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
            >
              Create a New Wallet
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