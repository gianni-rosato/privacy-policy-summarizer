import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";

// Initialize OAuth config and helpers
const oauthConfig = createGitHubOAuthConfig();
const {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} = createHelpers(oauthConfig);

export {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
};

// Types for Hono app
export type Bindings = {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
};

export type Variables = {
  sessionId?: string;
};