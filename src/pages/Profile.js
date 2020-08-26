import React, {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {auth0Config} from '../config';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import {Redirect} from 'react-router-dom';

export default function Profile(props) {
  const {
    isAuthenticated,
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    async function onMount() {
      try {
        const [user_metadata, apiResp] = await Promise.all([
          getUserMetaData(),
          getAssests(),
        ]);

        setUserMetadata(user_metadata);
        setAssets(apiResp);
        // console.log(apiResp);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      onMount();
    }
  }, [user]);

  async function getUserMetaData() {
    const accessToken = await getAccessTokenSilently({
      audience: `https://${auth0Config.domain}/api/v2/`,
      scope: 'read:current_user',
    });

    const userDetailsByIdUrl = `https://${auth0Config.domain}/api/v2/users/${user.sub}`;
    const metadataResponse = await fetch(userDetailsByIdUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const {user_metadata} = await metadataResponse.json();

    return user_metadata;
  }

  async function getAssests() {
    const idToken = await getIdTokenClaims();

    const res = await axios.get('http://localhost:8000/auth0', {
      headers: {
        Authorization: `Bearer ${idToken.__raw}`,
        'Content-Type': 'application/json',
      },
      method: 'get',
    });

    return res.data;
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>PROFILE</h1>
      <img src={user.picture} alt={user.name} />
      <h2>Hello {user.name} !</h2>
      <p>{user.email}</p>
      <h3>User Metadata</h3>
      {userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        'No user metadata defined'
      )}
      <p>From server: {assets || 'No assets returned'}</p>
      <LogoutButton />
    </div>
  );
}
