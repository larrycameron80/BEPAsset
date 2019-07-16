import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  root: {
    verticalAlign: 'bottom',
    minWidth: '100px',
    minHeight: '43px',
    width: '100%',
    marginBottom: '12px',
    fontWeight: 600,
    border: "1px solid #f5bc00",
    transition: "all 0.2s ease-in-out",
    padding: "0.6rem 2.5rem",
    lineHeight: "1.5",
    fontSize: "0.8rem",
    "&:hover": {
        //you want this to be the same as the backgroundColor above
        backgroundColor: "#f5bc00",
        color: "#FFF"
    }
  },
  fontStyle: {
    fontSize: '0.9rem'
  }
});

function StyledButton(props) {
  const {
    classes,
    label,
    fullWidth,
    onClick,
    onChange,
    disabled,
    type
  } = props;

  return (
    <Button
      className={ classes.root }
      fullWidth={ fullWidth }
      variant="outlined"
      color="primary"
      type={type}
      disabled={ disabled }
      onClick={ onClick }
      onChange={ onChange }
      classes={{ root: classes.fontStyle }}>
      <Icon>cloud_upload</Icon>&nbsp;{label}
    </Button>
  )
}

StyledButton.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string
};

export default withStyles(styles)(StyledButton);
