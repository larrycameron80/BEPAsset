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
    fontSize: '20px',
    marginBottom: '15px'
  }
});

function ComingSoon(props) {
  const {
    classes
  } = props;

  return (
    <Typography variant="h6" gutterBottom className={ classes.inline } >
      Coming Soon...
    </Typography>
  )
}

ComingSoon.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComingSoon);
