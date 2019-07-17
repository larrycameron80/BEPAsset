import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Grid,
  Typography
} from '@material-ui/core';
import StyledButton from '../common/button';

const styles = theme => ({
  root: {
    
  },
  dialogTitle: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  dialogContent: {
    padding: '0 40px 40px'
  },
  commitment: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'rgb(38, 49, 71)',
    marginBottom: '20px'
  },
  ul: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    listStyle: 'none',
    padding: '0px',
    '&>li': {
      width: '80px',
      height: '3px',
      cursor: 'pointer',
      position: 'relative',
      background: 'rgb(234, 236, 239)',
      borderRadius: '2px'
    }
  },
  selected: {
    background: 'rgb(240, 185, 11) !important'
  },
  cancel: {
    fontSize: '12px',
    cursor: "pointer",
    padding: '0.8rem 0.5rem',
    marginBottom: '12px',
    color: "#e1e1e1",
    '&:hover': {
      color: "#efc660"
    }
  }
});

const pages = [
  `Binance is committed to providing you with the best and safest experience on the Binance Chain. To do that, we ask for a minute of your time to understand how decentralized wallets work and to take action in safeguarding yourself. You can find the full Terms of Service here.`,
  `You are solely responsible for keeping your funds. No one else, not even Binance, can help you recover your wallet if you lose it.

When you create a wallet on Binance, you are provided with 3 different formats, each of them can be used to access your wallet.`,
  `1. Keystore File + Password
You can think of the keystore file like a “User ID”, while the password unlocks your wallet. Both are needed to access your wallet,so keep them safe. This is a required format on Binance.`,
  `2. Mnemonic Phrase
24 words that are both the “User ID” and password.This is a secondary way to access your wallet if you lose your keystore file or forget your password. Anyone who knows your mnemonic phrase can access your wallet, so keep it safe.`,
  `3. Private key
This is an alternative representation of the mnemonic phase words.

Binance requires all users to use the keystore file + password; and choose between the mnemonic phrase or private key as a secondary method.`];

function AlertDialog(props) {
  const {
    classes,
    fullScreen,
    open,
    onCancel
  } = props;

  let [page, setPage] = React.useState(0);

  const onNext = () => {
    if (page < 4) {
      setPage(++page);
      return
    }

    onCancel()
  };

  return (
    <Dialog
      fullScreen={ fullScreen }
      open={ open }
      fullWidth={ true }
      aria-labelledby="wallet-creation-tutorial"
    >
      <DialogTitle
        id="wallet-creation-tutorial"
        className={ classes.dialogTitle}
        disableTypography={ true }>{"Wallet Creation Tutorial"}</DialogTitle>
      <DialogContent
        className={ classes.dialogContent }
      >
        <div>
          <div className={ classes.commitment }>Our Commitment</div>
          <ul className={ classes.ul }>
            {pages.map((pageContent, pageIndex) => {
              return <li onClick={ (event) => {setPage(pageIndex)} } key={ pageIndex } className={ page === pageIndex ? classes.selected : '' }></li>
            })}
          </ul>
        </div>
        <Grid
          container
          direction="row"
          justify="space-evenly"
        >
          <Grid
            item
            xs={ 5 }
          >
            <Typography>
              &nbsp;
            </Typography>
          </Grid>
          <Grid
            item
            xs={ 7 }
          >
            <Typography>
              { pages[page] }
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ margin: '0', padding: '40px' }}>
        <Grid
        container
        justify="space-between"
        alignItems="center"
        direction="row">
          <Link
            className={ classes.cancel }
            onClick={ onCancel }
          >
            Skip Tutorial (Not Recommended)
          </Link>
          <StyledButton
            fullWidth={false}
            fill={true}
            label={ "Next" }
            disabled={ false }
            onClick={ onNext }
          />
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

AlertDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool,
  onCancel: PropTypes.func
};

export default withStyles(styles)(AlertDialog);
