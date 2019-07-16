import React, { Component } from 'react';
import { crypto } from '@binance-chain/javascript-sdk';
import PropTypes from 'prop-types';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  OutlinedInput,
  Link,
  Grid
} from '@material-ui/core';

import { colors } from '../../theme'
import config from "../../config";
import Input from '../common/input';
import Button from '../common/button';

import {
  SET_WALLET
} from '../../constants';
import Store from "../../stores";
const dispatcher = Store.dispatcher
const prefix = config.prefix;

const hasUppercaseTest = new RegExp(/[A-Z]/)
const hasNumberTest = new RegExp(/[0-9]/)
const hasSpecialTest = new RegExp(/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/)

const styles = theme => ({
  root: {
    marginTop: '50px',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.black
  },
  buttonWrapper: {
    padding: '0.5rem 0'
  }
});

class Mnemonic extends Component {
  state = {
    loading: false,
    mnemonic: null,
    password: null,
    mnemonicError: null,
    accept: false,
    passwordErrorText: null,
    passwordError: false
  };

  handlePassword = (event) => {
    this.setState({
      password: event.target.value,
      passwordErrorText: null
    })

    if (this.state.mnemonic 
        && this.state.mnemonic.split(' ').length >= 12 
        && event.target.value) {
      this.setState({
        accept: true
      })
    }
  };

  handleMnemonic = (event) => {
    const mnemonic = event.target.value;
    this.setState({
      mnemonic
    })

    if (mnemonic
       && mnemonic.split(' ').length >= 12
       && this.state.password) {
      this.setState({
        accept: true
      })
    }
  };

  unlockWalletWithMnemonic = () => {
    const password = this.state.password
    const mnemonic = this.state.mnemonic

    if (!password.length >= 8) {
      this.setState({
        passwordErrorText: "Minimum of 8 characters",
        passwordError: true
      })

      return;
    } else if (!hasSpecialTest.test(password)) {
      this.setState({
        passwordErrorText: "Contains at least one special character",
        passwordError: true
      })

      return;
    } else if (!hasUppercaseTest.test(password)) {
      this.setState({
        passwordErrorText: "Contains at least one uppercase character",
        passwordError: true
      })

      return;
    } else if (!hasNumberTest.test(password)) {
      this.setState({
        passwordErrorText: "Contains at least one number",
        passwordError: true
      })

      return;
    }

    try {
      const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
      console.log(privateKey)
      const keyStore = crypto.generateKeyStore(privateKey, password)
      console.log(keyStore)
      const address = crypto.getAddressFromPrivateKey(privateKey, prefix)
      console.log(address)
      
      dispatcher.dispatch({type: SET_WALLET, wallet: {keyStore, address} })

      this.setState({
        password: null,
        mnemonic: null
      })
      this.props.history.push('/token')
    } catch (e) {
      console.log('error!!!', e.message)
      this.setState({
        mnemonicError: e.message
      })
    }
  };

  render() {
    const { classes } = this.props;
    const { mnemonicError, accept, passwordErrorText } = this.state;

    return (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <Typography className={ classes.root }>
            Please enter your phrase
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          <OutlinedInput
            autoFocus={ true }
            fullWidth={ true }
            multiline={ true }
            rows={ 7 }
            rowsMax={ 7 }
            labelWidth={ 0 }
            onChange={ this.handleMnemonic }>
          </OutlinedInput>
          {mnemonicError && <Typography style={{ color: colors.red, fontSize: '12px' }}>{mnemonicError}</Typography>}
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="password"
            fullWidth={ true }
            label="Password"
            placeholder="Enter your wallet password"
            password="password"
            onChange={ this.handlePassword }
          />
          {passwordErrorText && <Typography style={{ color: colors.red, fontSize: '12px' }}>{passwordErrorText}</Typography>}
        </Grid>
        <Grid item container xs={12} 
          alignContent="space-between"
          style={{ marginTop: '20px' }}>
          <Grid item xs={ 6 } className={ classes.buttonWrapper }>
            <Link
              component={RouterLink}
              to="/create"
            >
              Create a New Wallet
            </Link>
          </Grid>
          <Grid item xs={ 6 }>
            <Button
              fullWidth={true}
              fill={true}
              style={{ letterSpacing: 0, padding: '0.8rem 0.5rem' }}
              label={ "Unlock Wallet Now" }
              disabled={ !accept }
              onClick={ this.unlockWalletWithMnemonic }
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  };
}

Mnemonic.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Mnemonic));