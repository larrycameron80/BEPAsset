import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import pencil from '../../static/pencil.svg';
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

function ConfirmDialog(props) {
  const {
    onClick,
    open,
    fullScreen,
    onCancel,
    label
  } = props;

  return (
    <Dialog
      fullScreen={ fullScreen }
      open={ open }
      onClose={ onCancel }
      maxWidth="xs"
      aria-labelledby="confirm-dialog-title"
    >
      <DialogContent>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={pencil} alt="Confirm Writing Logo" style={{ width: '80px' }} />
        </div>
        <DialogContentText>
          { label }
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ margin: '0 24px 10px' }}>
        <StyledButton
          fullWidth={false}
          onClick={ onCancel }
          fill={false}
          disabled={ false }
          label={ "Cancel" }
          style={{ letterSpacing: 0, padding: '0.8rem 0.5rem', marginLeft: '10px' }}
        />
        <StyledButton
          fullWidth={false}
          fill={true}
          style={{ letterSpacing: 0, padding: '0.8rem 0.5rem', marginLeft: '10px' }}
          label={ "Confirm" }
          disabled={ false }
          onClick={ onClick }
        />
      </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  fullScreen: PropTypes.bool,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  label: PropTypes.string
};

export default withStyles(styles)(ConfirmDialog);
