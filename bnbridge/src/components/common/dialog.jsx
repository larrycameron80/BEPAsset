import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import Input from '../common/input';
import StyledButton from '../common/button';

const styles = theme => ({
  root: {
    verticalAlign: 'bottom',
    minWidth: '200px',
    display: 'inline-block',
    marginTop: '15px',
    marginBottom: '15px'
  }
});

function StyledDialog(props) {
  const {
    onClick,
    open,
    fullScreen,
    onCancel
  } = props;

  const [password, setPassword] = React.useState('')

  return (
    <Dialog
      fullScreen={ fullScreen }
      open={ open }
      onClose={ onCancel }
      maxWidth="xs"
      onEnter={ (e) => { setPassword('') } }
      aria-labelledby="password-dialog-title"
    >
      <DialogTitle id="password-dialog-title">{"Password"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
        </DialogContentText>
        <Input
          id="password"
          fullWidth={ true }
          label=""
          placeholder="Enter your session password"
          password="password"
          autoFocus={ true }
          value={ password }
          onChange={ (e) => { setPassword(e.target.value) } }
        />
      </DialogContent>
      <DialogActions style={{ margin: '0 24px 10px' }}>
        <Button
          onClick={ onCancel }
          style={{ letterSpacing: 0.01, padding: '0.8rem 0.5rem', marginBottom: '12px' }}
        >
          Cancel
        </Button>
        <StyledButton
          fullWidth={false}
          fill={true}
          style={{ letterSpacing: 0, padding: '0.8rem 0.5rem', marginLeft: '10px' }}
          label={ "Confirm" }
          disabled={ false }
          onClick={ () => onClick(password) }
        />
      </DialogActions>
    </Dialog>
  )
}

StyledDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default withStyles(styles)(StyledDialog);
