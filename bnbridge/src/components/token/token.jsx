import React from 'react';
import { Redirect } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Grid
} from '@material-ui/core';

import bnbridgeTheme from '../../theme';

import Header from '../header';
import Instructions from '../instructions';
import Controller from '../controller';

import Store from "../../stores";
const store = Store.store

function Tokens(props) {
  if (!store.getStore('wallet')) {
    return <Redirect to="/" />
  }
  return (
    <MuiThemeProvider theme={ createMuiTheme(bnbridgeTheme) }>
      <CssBaseline />
      <Header />
      <Grid
        style={{maxWidth:"980px"}}
        className="main-box"
        container
        justify="center"
        alignItems="center"
        direction="row">
        <Grid item align='right' 
          style={{alignSelf:"flex-start"}}>
          <Instructions />
        </Grid>
        <Grid item align="center"
          className="vertical-line-wrapper"
          style={{alignSelf: "flex-start", marginTop: "110px"}}>
          <div className="vertical-line"></div>
        </Grid>
        <Grid item align="left">
          <Controller />
        </Grid>
      </Grid>
    </MuiThemeProvider>
  );
}

export default Tokens;
