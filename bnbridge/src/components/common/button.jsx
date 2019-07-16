import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button
} from '@material-ui/core';

const styles = theme => ({
  root: {
    verticalAlign: 'bottom',
    minWidth: '100px',
    minHeight: '43px',
    marginBottom: '12px',
    fontWeight: 700,
    border: "1px solid #f5bc00",
    transition: "all 0.2s ease-in-out",
    padding: "0.8rem 2.5rem",
    lineHeight: "1.5",
    letterSpacing: "0.03em",
    fontSize: "0.8rem",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#f5bc00",
      color: "#FFF"
    }
  },
  reverse: {
    verticalAlign: 'bottom',
    minWidth: '100px',
    minHeight: '43px',
    marginBottom: '12px',
    fontWeight: 700,
    border: "1px solid #f5bc00",
    backgroundColor: "#f5bc00",
    transition: "all 0.2s ease-in-out",
    padding: "0.8rem 2.5rem",
    lineHeight: "1.5",
    letterSpacing: "0.03em",
    fontSize: "0.8rem",
    color: "#FFF",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "#f5bc00",
      color: "#FFF"
    }
  }
});

function StyledButton(props) {
  const {
    classes,
    label,
    style,
    fullWidth,
    onClick,
    disabled,
    fill
  } = props;

  return (
      <Button
        className={ fill && !disabled ? classes.reverse : classes.root }
        fullWidth={ fullWidth }
        variant="outlined"
        color="primary"
        disabled={ disabled }
        style={ style }
        onClick={ onClick }>
        {label}
      </Button>
  )
}

StyledButton.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  style: PropTypes.object
};

export default withStyles(styles)(StyledButton);
