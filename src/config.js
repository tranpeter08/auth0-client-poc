export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
  scope: process.env.REACT_APP_AUTH0_SCOPES,
  redirectUri:
    process.env.REACT_APP_AUTH0_REDIRECT_URI || 'http://localhost:3000',
};
