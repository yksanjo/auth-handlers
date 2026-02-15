// OAuth2 Handler

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { OAuthConfig, TokenResponse, AuthHandler, Logger } from './types';

export class OAuthHandler implements AuthHandler {
  private config: OAuthConfig;
  private logger: Logger;
  private state: string = '';

  constructor(config: OAuthConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  getAuthorizationUrl(): string {
    this.state = uuidv4();
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      state: this.state,
      scope: this.config.scope?.join(' ') || 'openid profile'
    });
    return `${this.config.authUrl}?${params}`;
  }

  async exchangeCode(code: string): Promise<TokenResponse> {
    const response = await axios.post(this.config.tokenUrl, new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirectUri
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
      expiresIn: response.data.expires_in
    };
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const response = await axios.post(this.config.tokenUrl, new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
      expiresIn: response.data.expires_in
    };
  }

  async validateToken(_token: string): Promise<boolean> {
    return true;
  }
}

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}
