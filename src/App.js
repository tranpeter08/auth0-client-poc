import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Auth0Provider} from '@auth0/auth0-react';
import {auth0Config} from './config';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import './App.css';

function App() {
  return (
    <Auth0Provider {...auth0Config}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedRoute
            path="/profile"
            component={Profile}
            onRedirecting={() => <Loading />}
          />
        </Switch>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
