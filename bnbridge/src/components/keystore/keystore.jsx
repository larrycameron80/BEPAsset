import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { FilePicker } from 'react-file-picker';
import { crypto } from '@binance-chain/javascript-sdk';

import {
  Typography,
  Link,
  Grid
} from '@material-ui/core';
import PageLoader from "../common/pageLoader";

import { colors } from '../../theme'

import Icon from '@material-ui/core/Icon';
import Input from '../common/input';
import Button from '../common/button';
import FileButton from '../common/fileButton';

import config from "../../config";
import {
  SET_WALLET
} from '../../constants';

import Store from "../../stores";
const dispatcher = Store.dispatcher;
const prefix = config.prefix;
const store = Store.store

const styles = theme => ({
  root: {
    marginTop: '50px',
    marginBottom: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: colors.black
  },
  successUpload: {
    color: 'rgb(0, 192, 135)',
    position: 'absolute',
    top: '10px',
    right: '10px'
  },
  buttonWrapper: {
    padding: '0.5rem 0'
  }
});

class Keystore extends Component {
  state = {
    loading: false,
    keystore: null,
    password: '',
    keystoreError: null,
    accept: false,
    passwordError: false
  };

  reader = new FileReader();

  constructor(props) {
    super(props);

    this.reader.onload = this.fileLoad;
  };

  
  fileLoad = () => {
    try {
      const key = JSON.parse(this.reader.result)
      if (!('version' in key) || !('crypto' in key)) {
        this.setState({
          keystoreError: "Not a valid keystore file"
        })
      } else {
        this.setState({
          keystoreError: null,
          keystore: key,
          accept: this.state.password ? true : false
        })
      }
    } catch {
      this.setState({
        keystoreError: "Not a valid json file"
      })
    }
  };

  uploadKeystore = f => {
    this.reader.readAsText(f)
  };

  unlockWalletWithKeystore = async () => {
    const password = this.state.password
    const keystore = this.state.keystore
    this.setState({
      loading: true
    })

    if (password && keystore) {
      try {
        const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password)
        const address = crypto.getAddressFromPrivateKey(privateKey, prefix)

        await store.setPrivateKey(privateKey)

        dispatcher.dispatch({type: SET_WALLET, wallet: {keystore, address} })

        this.setState({
          password: '',
          keystore: null,
          loading: false
        })
        this.props.history.push('/token')
      } catch {
        this.setState({
          passwordError: true,
          passwordErrorText: "Wrong password",
          loading: false
        })
      }
    }

    return
  };

  handlePassword = (event) => {
    this.setState({
      password: event.target.value,
      passwordErrorText: '',
      passwordError: false
    })

    if (this.state.keystore && event.target.value) {
      this.setState({
        accept: true
      })
    }
  }

  render() {
    const { classes } = this.props;
    const { keystore, keystoreError, accept, password, passwordError, passwordErrorText, loading } = this.state;

    return (
      <React.Fragment>
        { loading && <PageLoader /> }
        <Grid item xs={ 12 }>
          <Typography className={ classes.root }>
            Select your keystore file
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          <FilePicker
            onChange={f => (this.uploadKeystore(f))}
            onError={err => (console.error(err))}
          >
            <div style={{ position: 'relative' }}>
              <FileButton
                label="Upload keystore file">
              </FileButton>
              {keystore && !keystoreError && 
              <Icon className={classes.successUpload}>check</Icon>
              }
            </div>
          </FilePicker>
          {keystoreError && <Typography>{keystoreError}</Typography>}
        </Grid>
        <Grid item xs={ 12 }>
          <Input
            id="password"
            fullWidth={ true }
            label="Password"
            placeholder="Enter your wallet password"
            password="password"
            value={ password }
            error={ passwordError }
            onChange={ this.handlePassword }
          />
          {passwordErrorText && <Typography style={{ color: colors.red }}>{passwordErrorText}</Typography>}
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
              onClick={ this.unlockWalletWithKeystore }
            />
          </Grid>
        </Grid>
      </React.Fragment>
    )
  };
}

Keystore.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Keystore));