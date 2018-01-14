import React from 'react';
import { Route, Switch } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

import App from 'containers/App';
import HomePage from 'pages/HomePage';
import NotFoundPage from 'pages/NotFoundPage';

export default (
  <ConnectedRouter history={createHistory()}>
    <App>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="*" component={NotFoundPage}/>
      </Switch>
    </App>
  </ConnectedRouter>
);
