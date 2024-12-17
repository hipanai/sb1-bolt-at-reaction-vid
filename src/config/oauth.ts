import { AIRTABLE_CONFIG } from './constants';

// OAuth configuration
export const OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_AIRTABLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  scope: 'data.records:read data.records:write schema.bases:read',
  authUrl: 'https://airtable.com/oauth2/v1/authorize',
  tokenUrl: 'https://airtable.com/oauth2/v1/token',
};

export async function getAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: OAUTH_CONFIG.scope,
  });

  return `${OAUTH_CONFIG.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch(OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: import.meta.env.VITE_AIRTABLE_CLIENT_SECRET,
      redirect_uri: OAUTH_CONFIG.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  return data.access_token;
}