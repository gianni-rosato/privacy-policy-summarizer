import { createGoogleOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";

const redirectUri: string = Deno.env.get("REDIRECT_URI") || "http://localhost:8000/oauth/callback";
const scope: string = Deno.env.get("GOOGLE_SCOPE") || "";

// Initialize OAuth config and helpers
const oauthConfig = createGoogleOAuthConfig({
  redirectUri: redirectUri,
  scope: scope,
});
const {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} = createHelpers(oauthConfig);

export { getSessionId, handleCallback, signIn, signOut };

// Types for Hono app
export type Bindings = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
};

export type Variables = {
  sessionId?: string;
};
