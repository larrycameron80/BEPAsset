import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { crypto } from '@binance-chain/javascript-sdk';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  Link,
  Button,
  Grid,
  Checkbox,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField
} from '@material-ui/core';

import {
  ERROR,
  DOWNLOAD_BNB_KEYSTORE,
  BNB_KEYSTORE_DOWNLOADED
} from '../../constants'

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Icon from '@material-ui/core/Icon';
import successIcon from '../../static/success.svg';
import { colors } from '../../theme'

import Header from '../header';
import StyledButton from "../common/button";
import AlertDialog from "../common/alertDialog";
import ConfirmDialog from "../common/confirmDialog";
import PageLoader from "../common/pageLoader";

import config from "../../config";
import Store from "../../stores";
const dispatcher = Store.dispatcher;
const store = Store.store
const emitter = Store.emitter

const hasUppercaseTest = new RegExp(/[A-Z]/)
const hasNumberTest = new RegExp(/[0-9]/)
const hasSpecialTest = new RegExp(/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/)

const styles = theme => ({
  header: {
    width: '100%',
    marginTop: '30px',
    textAlign: 'center',
    paddingBottom: '20px'
  },
  title: {
    fontSize: '2.5em',
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subTitle: {
    textAlign: 'center',
    color: colors.black,
    fontSize: '16px',
    fontWeight: 'bold',
    paddingBottom: '15px',
    paddingTop: '10px'
  },
  cautionUrl: {
    padding: '3px 15px',
    background: colors.gray,
    color: colors.darkBlack,
    fontSize: '14px',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '235px',
    margin: 'auto'
  },
  pageTitle: {
    fontSize: '16px',
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '30px'
  },
  formControl: {
    marginTop: '25px'
  },
  inputField: {
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 600
  },
  inputFieldset: {
    borderTop: '0px',
    borderLeft: '0px',
    borderRight: '0px'
  },
  inputRoot: {
    background: colors.white
  },
  buttonWrapper: {
    marginTop: '40px'
  },
  button: {
    background: colors.gray,
    borderRadius: '15px',
    padding: '7px 20px',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  checkboxWrapper: {
    marginTop: '40px'
  },
  checkboxLabel: {
    lineHeight: 1.3,
    fontSize: '12px'
  },
  checkbox: {
    color: colors.lightBlack
  },
  passwordErrorAera: {
    background: colors.lightGray,
    marginTop: '5px',
    padding: '10px',
    border: `1px solid ${colors.gray}`
  },
  passwordErrorDesc: {
    fontSize: '14px'
  },
  passwordInstructions: {
    margin: '0 0 0 30px',
    padding: 0,
    '&>li': {
      fontSize: '14px'
    }
  },
  pass: {
    color: colors.green
  },
  invalid: {
    color: colors.red
  },
  mnemonic: {
    width: '122px',
    height: '38px',
    textAlign: 'center',
    lineHeight: '38px',
    position: 'relative',
    color: 'rgb(33, 40, 51)',
    fontSize: '14px',
    fontWeight: '600',
    float: 'left',
    marginRight: '10px',
    marginBottom: '10px',
    background: colors.lightGray,
    borderRadius: '3px'
  },
  mnemonicIndex: {
    position: 'absolute',
    top: '5px',
    left: '5px',
    color: 'rgb(132, 142, 156)',
    fontSize: '12px',
    lineHeight: '12px'
  }
});

class CreateWallet extends Component {
  state = {
    page: 0,
    loading: false,
    alertOpen: false,
    alertPage: 0,
    passwordError: false,
    password: '',
    confirmPasswordError: null,
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false,
    lengthPass: false,
    specialPass: false,
    accept: "0",
    mnemonic: null,
    privateKey: null,
    confirmOpen: false,
    mnemonics: ['', '', ''],
    mnemonicsError: [false, false, false],
    mnemonicOrder: [],
    compareError: false
  };

  componentWillMount() {
    emitter.on(ERROR, this.error);
    emitter.on(BNB_KEYSTORE_DOWNLOADED, this.bnbKeystoreDownloaded)
  };

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.error);
    emitter.removeListener(BNB_KEYSTORE_DOWNLOADED, this.bnbKeystoreDownloaded)
  };

  error = (err) => {
    this.props.showError(err)
    this.setState({ loading: false })
  };

  onCancel = () => {
    this.setState({
      alertOpen: false
    })
  };

  handleClickShowPassword = () => {
    const pwd = this.state.showPassword
    this.setState({
      showPassword: !pwd
    })
  };

  handleClickShowConfirmPassword = () => {
    const pwd = this.state.showConfirmPassword
    this.setState({
      showConfirmPassword: !pwd
    })
  };

  changePassword = (event) => {
    const pwd = event.target.value
    this.setState({
      password: pwd
    })

    if (pwd.length < 8) {
      this.setState({
        lengthPass: false,
        passwordError: true
      })
    } else {
      this.setState({
        lengthPass: true
      })
    }

    if (!hasSpecialTest.test(pwd) || !hasUppercaseTest.test(pwd) || !hasNumberTest.test(pwd)) {
      this.setState({
        specialPass: false,
        passwordError: true
      })
    } else {
      this.setState({
        specialPass: true
      })
    }

    if (this.state.lengthPass && this.state.specialPass) {
      this.setState({
        passwordError: false
      })
    }
  };

  changeConfirmPassword = (event) => {
    const pwd = event.target.value
    this.setState({
      confirmPassword: pwd
    })

    if (this.state.password !== pwd) {
      this.setState({
        confirmPasswordError: true
      })
    } else {
      this.setState({
        confirmPasswordError: false
      })
    }
  };

  renderPage0 = () => {
    const { classes } = this.props;
    const {
      passwordError,
      showPassword,
      confirmPasswordError,
      showConfirmPassword,
      lengthPass,
      specialPass
    } = this.state;

    return (
      <Grid
        container
      >
        <Grid item xs={12}>
          <Typography className={ classes.pageTitle }>
            Create Keystore File + Password
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl
            className={classes.formControl}
            variant="outlined"
            fullWidth={ true }
            error={passwordError}>
            <OutlinedInput
              placeholder="Set a New Password"
              fullWidth={ true }
              defaultValue={ '' }
              labelWidth={ 0 }
              disabled={ false }
              onChange={ this.changePassword }
              type={ showPassword ? 'text' : 'password' }
              classes={{input: classes.inputField, notchedOutline: classes.inputFieldset, root: classes.inputRoot}}
              endAdornment={ 
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={ 12 }>
          {passwordError && <div className={ classes.passwordErrorAera }>
            <div className={ classes.passwordErrorDesc }>Your password must include the following properties:</div>
            <ul className={ classes.passwordInstructions }>
              <li className={ lengthPass ? classes.pass : classes.invalid }>8 or more characters</li>
              <li className={ specialPass ? classes.pass : classes.invalid }>An upper-case letter, symbol and a number</li>
            </ul>
          </div>
          }
        </Grid>
        <Grid item xs={ 12 }>
          <FormControl
            className={classes.formControl}
            variant="outlined"
            fullWidth={ true }
            error={confirmPasswordError}>
            <OutlinedInput
              placeholder="Re-enter Password"
              fullWidth={ true }
              defaultValue={ '' }
              labelWidth={ 0 }
              disabled={ false }
              onChange={ this.changeConfirmPassword }
              type={ showConfirmPassword ? 'text' : 'password' }
              classes={{input: classes.inputField, notchedOutline: classes.inputFieldset, root: classes.inputRoot}}
              endAdornment={ 
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowConfirmPassword}>
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={ 12 }>
          {confirmPasswordError && <Typography style={{ color: colors.red, fontSize: '14px' }}>The password entered does not match
          </Typography>
          }
        </Grid>
      </Grid>
    )
  };

  renderPage1 = () => {
    const { classes } = this.props;

    return (
      <Grid
        container
      >
        <Grid item xs={12}>
          <Typography className={ classes.pageTitle }>
            Create Keystore File + Password
          </Typography>
        </Grid>
        <Grid item xs={12}>
          
        </Grid>
        <Grid item xs={ 12 }>
          <Typography className={ classes.inputField }>
            We are about to show your mnemonic phrase, please ensure that no one else is looking at your screen.
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          
        </Grid>
      </Grid>
    )
  };

  writeConfirm = () => {
    const mnemonicOrder = [Math.round(Math.random() * 23) + 1, Math.round(Math.random() * 23) + 1, Math.round(Math.random() * 23) + 1].sort((a, b) => {
      return a - b
    });
    this.setState({
      confirmOpen: false,
      page: 3,
      mnemonicOrder
    })
  };

  closeConfirm = () => {
    this.setState({
      confirmOpen: false
    })
  };

  renderPage2 = () => {
    const { classes } = this.props
    const { mnemonic, confirmOpen } = this.state;

    return (
      <Grid
        container
      >
        <Grid item xs={12}>
          <Typography className={ classes.pageTitle }>
            Choose Secondary Access
          </Typography>
          <Typography className={ classes.inputField }>
            Back up the text below on paper and keep it somewhere secret and safe.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ marginTop: '20px' }}>
          {
            mnemonic.split(' ').map((word, index) => {
              return (<div key={ index } className={ classes.mnemonic }>{ word }
                  <div className={ classes.mnemonicIndex }>#{index + 1}</div>
                </div>)
            })
          }
          </div>
        </Grid>
        <Grid item xs={ 12 }>
          <Typography className={ classes.inputField }>
            
          </Typography>
        </Grid>
        <Grid item xs={ 12 }>
          
        </Grid>
        <ConfirmDialog
          label="Are you sure you have noted down your Mnemonic Phrase?"
          onClick={this.writeConfirm}
          onCancel={this.closeConfirm}
          fullScreen={false}
          open={confirmOpen}
        />
      </Grid>
    )
  };

  onMnemonicInput = (event, index) => {
    const { mnemonic, mnemonics, mnemonicsError } = this.state

    if (!mnemonic.includes(event.target.value)) {
      mnemonicsError[index] = true
    }

    mnemonics[index] = event.target.value
    this.setState({
      mnemonics,
      mnemonicsError
    })
  }

  renderPage3 = () => {
    const { classes } = this.props
    const { mnemonics, mnemonicOrder, mnemonicsError, compareError } = this.state;
    
    return (
      <Grid
        container
      >
        <Grid item xs={12}>
          <Typography className={ classes.pageTitle }>
            Choose Secondary Access
          </Typography>
          <Typography className={ classes.inputField }>
            Please select the Mnemonic Phrase in the correct order to ensure that your copy is correct.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-evenly' }}>
          {
            mnemonicOrder.map((order, index) => {
              return (<div key={ index }>
                  <div >#{order}</div>
                  <TextField
                    value={ mnemonics[index] }
                    margin="normal"
                    variant="outlined"
                    error={ mnemonicsError[index] }
                    onChange={(event) => { this.onMnemonicInput(event, index) }}
                    inputProps={{ 'aria-label': 'bare' }}
                  />
                </div>)
            })
          }
          </div>
        </Grid>
        <Grid item xs={ 12 }>
          {compareError && <Typography style={{color: colors.red, fontSize: '12px'}}>Incorrect Mnemonic Phrase order, Please try again.</Typography>}
        </Grid>
      </Grid>
    )
  };

  goToUnlock = () => {
    this.props.history.push('/')
  }

  renderPage4 = () => {
    const { classes } = this.props
    
    return (
      <Grid
        container
      >
        <Grid item xs={12}>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={successIcon} alt="Confirm Writing Logo" style={{ width: '50px' }} />
          </div>
          <Typography className={ classes.pageTitle } style={{marginBottom: '30px'}}>
            You're all set!
          </Typography>
          <Typography className={ classes.inputField } style={{marginBottom: '40px'}}>
            You are ready to use the Binance Chain Wallet and Decentralized Exchange!
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <StyledButton
            fullWidth={false}
            fill={true}
            style={{ letterSpacing: 0, padding: '0.8rem 0.5rem' }}
            label={ "Unlock the wallet" }
            disabled={ false }
            onClick={ this.goToUnlock }
          />
        </Grid>
      </Grid>
    )
  };

  downloadKeystore = async () => {
    const {
      password,
      confirmPassword,
      accept
    } = this.state

    if (accept === "0") {
      return
    }

    if (password !== confirmPassword) {
      this.setState({
        confirmPasswordError: true
      })
      return
    }

    this.setState({
      loading: true
    })

    try {
      const account = await store.bncClient.createAccountWithMneomnic()
      this.setState({
        mnemonic: account.mnemonic,
        privateKey: account.privateKey
      })
      const keystore = crypto.generateKeyStore(account.privateKey, password)
      const clientId = keystore.id
      const content = {
        clientId,
        keystore
      };
      dispatcher.dispatch({type: DOWNLOAD_BNB_KEYSTORE, content })
    } catch (e) {
      console.log(e)
    }
  };

  bnbKeystoreDownloaded = () => {
    this.setState({
      loading: false,
    }, () => {
      this.setState({ page: 1 })
    })
  };

  handleAccept = () => {
    const { accept } = this.state
    this.setState({
      accept: accept === "0" ? "1" : "0"
    })
  };

  compareMnemonic = () => {
    const { mnemonic, mnemonics, mnemonicOrder } = this.state;
    let completed = 0;
    mnemonicOrder.forEach((order, index) => {
      const m = mnemonic.split(' ')
      if (m[order - 1] === mnemonics[index]) {
        completed++
      }
    })

    if (completed < 3) {
      this.setState({
        compareError: true
      })

      return
    }

    this.setState({
      page: 4
    })
  };

  onGoNext = () => {
    switch (this.state.page) {
      case 0:
        this.downloadKeystore()
        break;
      case 1:
        this.setState({
          page: this.state.page + 1
        })
        break;
      case 2:
        this.setState({
          confirmOpen: true
        })
        break;
      case 3:
        this.compareMnemonic()
        break;
      default:
        break;
    }
  };

  onGoBack = (page) => {
    console.log('back: ', page)
    this.setState({
      page: --page
    })
  };

  render() {
    const { classes } = this.props;
    const {
      page,
      loading,
      alertOpen,
      accept
    } = this.state;

    return (
      <div>
        { loading && <PageLoader /> }
        <Header />
        <Grid
          style={{maxWidth:"780px", padding: '40px 60px'}}
          className="main-box"
          container
          justify="space-evenly"
          alignItems="center"
          direction="row">
          <Grid item xs={12}>
            <div className={classes.header}>
              <Typography className={classes.title}>Unlock Your Wallet</Typography>
              <Typography className={classes.subTitle}>Please check that you are visiting https://www.bepasset.org</Typography>
              <div className={classes.cautionUrl}><Icon fontSize="small">https</Icon>&nbsp;<span style={{ color: colors.green }}>https:</span>//www.bepasset.org</div>
            </div>
          </Grid>
          { page === 0 && this.renderPage0() }
          { page === 1 && this.renderPage1() }
          { page === 2 && this.renderPage2() }
          { page === 3 && this.renderPage3() }
          { page === 4 && this.renderPage4() }
          {page === 0 && <Grid container className={ classes.buttonWrapper }>
            <Grid item xs={ 6 } >
              <Link
                component={RouterLink}
                to="/"
              >
                Unlock an Existing Wallet
              </Link>
            </Grid>
            <Grid item xs={ 6 } align="right" >
              <Button
                id="download-keystore"
                disabled={ loading }
                fullWidth={ false }
                className={ classes.button }
                onClick={ this.onGoNext }
              >
                Download Keystore File
              </Button>
            </Grid>
          </Grid>
          }
          {(page > 0 && page < 4) && <Grid container className={ classes.buttonWrapper }>
            <Grid item xs={ 6 } >
              <Button
                id="previous"
                disabled={ loading }
                fullWidth={ false }
                className={ classes.button }
                onClick={ () => { this.onGoBack(page); } }
              >
                Previous
              </Button>
            </Grid>
            <Grid item xs={ 6 } align="right" >
              <Button
                id="continue"
                disabled={ loading }
                fullWidth={ false }
                className={ classes.button }
                onClick={ this.onGoNext }
              >
                Continue
              </Button>
            </Grid>
          </Grid>
          }
          {page === 0 && <Grid item xs={ 12 } className={ classes.checkboxWrapper }>
            <FormControlLabel
              control={
                <Checkbox
                  id="accept"
                  color="secondary"
                  value={accept}
                  className={classes.checkbox}
                  onChange={ this.handleAccept }
                />
              }
              label="I understand that Spenchain cannot recover or reset my password or the keystore file. I will make a backup of the keystore file/password, keep them secret, complete all wallet creation steps and agree to all the terms."
              classes={{ label: classes.checkboxLabel }}
            />
          </Grid>
          }
        </Grid>
        <AlertDialog
          open={ alertOpen }
          page={ 0 }
          onCancel={ this.onCancel }
        >
        </AlertDialog>
      </div>
    )
  };
}

CreateWallet.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(CreateWallet));
