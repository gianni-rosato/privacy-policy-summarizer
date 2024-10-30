import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";

const clientId: string = Deno.env.get("CLIENT_ID") || "";
const clientSecret: string = Deno.env.get("CLIENT_SECRET") || "";

if (Deno.env.get("CLIENT_ID")) {
  Deno.env.set("GITHUB_CLIENT_ID", clientId!);
}
if (Deno.env.get("CLIENT_SECRET")) {
  Deno.env.set("GITHUB_CLIENT_SECRET", clientSecret!);
}

// Initialize OAuth config and helpers
const oauthConfig = createGitHubOAuthConfig();
const {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} = createHelpers(oauthConfig);

export { getSessionId, handleCallback, signIn, signOut };

// Types for Hono app
export type Bindings = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
};

export type Variables = {
  sessionId?: string;
};
