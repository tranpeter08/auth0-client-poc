import React, {useEffect, useState} from 'react';
import LoginButton from '../components/LoginButton';
import {Redirect} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';

export default function Home(props) {
  const {isAuthenticated, user, isLoading} = useAuth0();

  if (isLoading) return <div>LOADING...</div>;

  return (
    <>
      <p>HOME</p>
      {isAuthenticated ? (
        <Redirect to={{pathname: '/profile', state: {user}}} />
      ) : (
        <>
          <LoginButton />
        </>
      )}
    </>
  );
}
