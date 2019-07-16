import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import bnbridgeTheme from './theme';

import Token from './components/token';
import UnlockWallet from './components/unlockWallet';
import CreateWallet from './components/createWallet';

function App(props) {
  return (
    <MuiThemeProvider theme={ createMuiTheme(bnbridgeTheme) }>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" exact component={UnlockWallet} />
          <Route path="/token" exact component={Token} />
          <Route path="/create" exact component={CreateWallet} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
