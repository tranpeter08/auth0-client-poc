import React, {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {auth0Config, RESOURCE_SERVER_URL} from '../config';
import axios from 'axios';
import LogoutButton from '../components/LogoutButton';
import {Redirect} from 'react-router-dom';

export default function Profile(props) {
  const {
    user,
    getAccessTokenSilently,
    getIdTokenClaims,
    getAccessTokenWithPopup,
  } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [assets, setAssets] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      getUserInfo();
    }
  }, [user]);

  async function getUserInfo() {
    try {
      const [user_metadata, apiResp] = await Promise.all([
        getUserMetaData(),
        getAssests(),
      ]);

      setUserMetadata(user_metadata);
      setAssets(apiResp);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserMetaData() {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${auth0Config.domain}/api/v2/`,
        scope: auth0Config.scope,
        redirect_uri: auth0Config.redirectUri,
      });

      const userDetailsByIdUrl = `https://${auth0Config.domain}/api/v2/users/${user.sub}`;
      const metadataResponse = await fetch(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'content-type': 'application/json',
        },
        method: 'get',
      });

      const data = await metadataResponse.json();

      console.log(data);

      return data.user_metadata;
    } catch (error) {
      console.error(error);
    }
  }

  async function updateAuth0UserMetadata() {
    try {
      const userDetailsByIdUrl = `https://${auth0Config.domain}/api/v2/users/${user.sub}`;
      const accessToken = await getAccessTokenSilently({
        audience: `https://${auth0Config.domain}/api/v2/`,
        scope: auth0Config.scope,
        redirect_uri: auth0Config.redirectUri,
      });

      const resp = await axios.patch(
        userDetailsByIdUrl,
        {user_metadata: {email}},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(resp.data);
      setUserMetadata(resp.data.user_metadata);
      // return data.user_metadata;
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getAssests() {
    const idToken = await getIdTokenClaims();

    const res = await axios.get(`${RESOURCE_SERVER_URL}/auth0`, {
      headers: {
        Authorization: `Bearer ${idToken.__raw}`,
        'Content-Type': 'application/json',
      },
      method: 'get',
    });

    return res.data;
  }

  // console.log({userMetadata, user});

  return (
    <div className="profile">
      <h1>PROFILE PAGE</h1>
      <img src={user.picture} alt={user.name} />
      <h2>Hello {user.name} !</h2>
      <p>
        Email: {user.email || (userMetadata && userMetadata.email) || 'N/A'}
      </p>
      {user.email || (userMetadata && userMetadata.email) ? null : (
        <div>
          <label>
            Please enter email address
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <button
            onClick={() => {
              updateAuth0UserMetadata();
            }}
          >
            SUBMIT
          </button>
        </div>
      )}
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
