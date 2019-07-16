import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import logo from '../../static/spend-logo-large.png';

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    height: '150px',
    padding: '10px',
    textAlign: 'center',
    marginTop: '30px',
    marginBottom: '20px'
  }
});

function Header(props) {
  const {
    classes
  } = props;

  return (
    <div className={ classes.root }>
      <img src={logo} alt="Spend Logo" />
    </div>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
