import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography
} from '@material-ui/core';

const styles = theme => ({
  inline: {
    verticalAlign: 'middle',
    display: 'inline-block',
    width: 'calc(100% - 50px)',
    fontSize: '15px',
    marginBottom: '15px'
  }
});

function Label(props) {
  const {
    label,
    classes,
    withCheckbox
  } = props;

  return (
    <Typography variant="h6" gutterBottom className={ classes.inline } style={withCheckbox ? {marginBottom: 0} : null}>
      {label}
    </Typography>
  )
}

Label.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  withCheckbox: PropTypes.bool
};

export default withStyles(styles)(Label);
