import React from 'react';
import {withAuthenticationRequired} from '@auth0/auth0-react';
import {Route} from 'react-router-dom';

export default function ProtectedRoute({component, onRedirecting, ...args}) {
  return (
    <Route
      component={withAuthenticationRequired(component, {
        onRedirecting,
      })}
      {...args}
    />
  );
}
