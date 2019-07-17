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
import SvgIcon from '@material-ui/core/SvgIcon';
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
  },
  markGithub: {
    marginLeft: '5px',
    paddingTop: '1px',
    color: 'black'
  }
});

class UnlockWallet extends Component {
  state = {
    walletType: 2,
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
              <div className={classes.cautionUrl}>
                <Icon fontSize="small">https</Icon>&nbsp;
                <span style={{ color: colors.green }}>https:</span><span>&#47;&#47;www.bepasset.org</span></div>
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
        <span role='img' aria-label='open source community'>Made with ❤️ by Spend. Open-sourced for the community: See Source</span>
        <a href="https://github.com/Spend/BEPAsset" target="blank">
          <SvgIcon fontSize="inherit" color="inherit" className={classes.markGithub}>
          <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
          </SvgIcon>
        </a>
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
