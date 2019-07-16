import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { crypto, ledger } from '@binance-chain/javascript-sdk';
import { Link as RouterLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  Link,
  Grid
} from '@material-ui/core';

import { colors } from '../../theme'

import Button from '../common/button';
import PageLoader from "../common/pageLoader";

import instructionIcon1 from '../../static/circle-1.svg';
import instructionIcon2 from '../../static/circle-2.svg';
import ledgerIcon1 from '../../static/ledger-1.svg';
import ledgerIcon2 from '../../static/ledger-2.svg';

import Header from '../header';

import Store from "../../stores";
const dispatcher = Store.dispatcher
const emitter = Store.emitter
const store = Store.store

const LONG_TIME = 15000
const transClass = ledger.transports.u2f

const styles = theme => ({
  root: {
    marginTop: '45px',
    marginBottom: '0px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.black
  },
  buttonWrapper: {
    padding: '0.5rem 0'
  },
  instruction: {
    width: '100%',
    padding: '20px 30px',
    marginBottom: '20px',
    background: colors.lightGray,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  instructionContent1: {
    fontWeight: 600,
    fontSize: '18px'
  },
  instructionContent2: {
    
  },
  instructionSubContent1: {
    fontWeight: 600,
    fontSize: '18px',
    margin: 0
  },
  instructionSubContent2: {
    fontSize: '12px',
    margin: 0
  }
});

class Ledger extends Component {
  state = {
    loading: false,
    mneonic: null,
    password: null,
    mneonicError: null
  };

  unlockWalletWithLedger = async () => {
    try {
      const transport = await transClass.create(LONG_TIME)
      const ledgerApp = new ledger.app(transport)
    } catch (e) {
      console.log(e)
    }
  };

  render() {
    const { classes } = this.props;
    const { mneonic, mneonicError } = this.state;

    return (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <Typography className={ classes.root }>
            &nbsp;
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          <div className={ classes.instruction }>
            <img src={ instructionIcon1 } alt="No 1" />
            <span className={ classes.instructionContent1 }>Enter PIN Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <img src={ ledgerIcon1 } alt="Ledger Screen 1" />
          </div>
        </Grid>
        <Grid item xs={ 12 }>
          <div className={ classes.instruction }>
            <img src={ instructionIcon2 } alt="No 2" />
            <div>
              <p className={ classes.instructionSubContent1 }>Open Binance Chain</p>
              <p className={ classes.instructionSubContent2 }>"Binance Chain Ready"</p>
              <p className={ classes.instructionSubContent2 }>must be on-screen</p>
            </div>
            <img src={ ledgerIcon2 } alt="Ledger Screen 1" />
          </div>
        </Grid>
        <Grid item container xs={12} 
          alignContent="space-between"
          style={{ marginTop: '20px', fontSize: '12px' }}>
          <Grid item xs={ 8 }>
            <Link
              component={RouterLink}
              to="/create"
            >
              App Installation && Usage Instructions
            </Link>
            <br />
            <Link
              component={RouterLink}
              to="/create"
            >
              Having Connection Issues?
            </Link>
          </Grid>
          <Grid item xs={ 4 }>
            <Button
              fullWidth={true}
              fill={true}
              style={{ letterSpacing: 0, padding: '0.8rem 0.5rem' }}
              label={ "Connect to Ledger" }
              onClick={ this.unlockWalletWithLedger }
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  };
}

Ledger.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Ledger);