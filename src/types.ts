// Auth Handlers Types

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  redirectUri: string;
  scope?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
}

export interface AuthHandler {
  getAuthorizationUrl(): string;
  exchangeCode(code: string): Promise<TokenResponse>;
  refresh(refreshToken: string): Promise<TokenResponse>;
  validateToken(token: string): Promise<boolean>;
}

export interface Logger {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
  debug: (msg: string, meta?: Record<string, unknown>) => void;
}
