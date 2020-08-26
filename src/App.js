import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import {auth0Config} from './config';
import Home from './pages/Home';
import Profile from './pages/Profile';

console.log(auth0Config);

function App() {
  return (
    <Auth0Provider {...auth0Config}>
      <BrowserRouter>
        <Switch>
          <Route path="/profile" component={Profile} />
          <Route exact path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
