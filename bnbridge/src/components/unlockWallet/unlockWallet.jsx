import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid
} from '@material-ui/core';

import Icon from '@material-ui/core/Icon';
import { colors } from '../../theme'

import Header from '../header';
import Keystore from '../keystore';
import Mnemonic from '../mnemonic';
import ComingSoon from '../common/comingSoon';

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
  instruction: {
    fontSize: '16px',
    color: colors.black,
    textAlign: 'left',
    fontWeight: 'bold',
    padding: '20px 0'
  },
  walletType: {
    alignSelf:"flex-start",
    width: '330px'
  },
  mainPanel: {
    width: '470px'
  },
  verticalLine: {
    alignSelf: "flex-start",
    height: '200px',
    border: '1px solid',
    borderColor: '#eaeaea',
    marginTop: '70px'
  },
  selected: {
    boxShadow: '0px 0px 10px 5px rgb(100, 100, 100, .1)',
    borderRadius: '10px',
    backgroundColor: '#fff !important'
  },
  listitemText: {
    fontWeight: 'bold',
    color: colors.black
  },
  listitemIcon: {
    marginRight: 0
  }
});

class UnlockWallet extends Component {
  state = {
    walletType: 0,
    walletTypeLabels: ['WalletConnect', 'Ledger Device', 'KeyStore File', 'Mnemonic Phrase']
  };

  handleWalletType = (event, type) => {
    this.setState({ walletType: type });
  };

  render() {
    const { classes } = this.props;
    const { walletType } = this.state;

    return (
      <div>
        <Header />
        <Grid
          style={{maxWidth:"980px", paddingBottom: '50px'}}
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
          { this.renderWalletType() }
          <Grid item align="center" style={{alignSelf:"flex-start"}}>
            <div className={classes.verticalLine}></div>
          </Grid>
          { walletType === 0 && this.renderWalletConnect() }
          { walletType === 1 && this.renderLedgerDevice() }
          { walletType === 2 && this.renderKeyStoreFile() }
          { walletType === 3 && this.renderMnemonicPhrase() }
        </Grid>
      </div>
    )
  };

  renderWalletType() {
    const { classes } = this.props;
    const { walletType, walletTypeLabels } = this.state;

    return (
      <Grid item align='center'
        className={classes.walletType}>
        <Typography className={classes.instruction}>Select how you would like to unlock</Typography>
        <List
          component="nav"
          className={classes.listitem}
          arial-label="Unlock Method">
          {walletTypeLabels.map((label, index) => <ListItem
            key={index}
            button
            selected={walletType === index}
            onClick={event => this.handleWalletType(event, index)}
            classes={{ selected: classes.selected }}>
              <ListItemText primary={ label } classes={{ primary: classes.listitemText }}>
              </ListItemText>
              <ListItemIcon classes={{ root: classes.listitemIcon }}>
                <Icon 
                  style={walletType === index ? {"color": colors.yellow} : {"color": colors.gray}}>
                  {walletType === index ? 'radio_button_checked' : 'radio_button_unchecked'}
                </Icon>
              </ListItemIcon>
            </ListItem>)}
        </List>
      </Grid>
    )
  };

  renderWalletConnect() {
    const { classes } = this.props;

    return (
      <Grid item className={classes.mainPanel} align="left">
        <ComingSoon />
      </Grid>
    )
  };

  renderLedgerDevice() {
    const { classes } = this.props;

    return (
      <Grid item className={classes.mainPanel} align="left">
        <ComingSoon />
      </Grid>
    )
  };

  renderKeyStoreFile() {
    const { classes } = this.props;

    return (
      <Grid item className={classes.mainPanel} align="left">
        <Keystore />
      </Grid>
    )
  };

  renderMnemonicPhrase() {
    const { classes } = this.props;

    return (
      <Grid item className={classes.mainPanel} align="left">
        <Mnemonic />
      </Grid>
    )
  };
}

UnlockWallet.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UnlockWallet);
