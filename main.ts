import "jsr:@std/dotenv/load";
import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
// import { stream, streamText, streamSSE } from 'jsr:@hono/hono/streaming'
import { Renderer } from "jsr:@libs/markdown";
import { createGitHubOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import {
  getComparisonPrompt,
  getCompletion,
  getSummaryPrompt,
} from "./services/llm.ts";
import {
  type Bindings,
  type Variables,
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} from "./services/auth.ts";

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// Authentication middleware
app.use('/api/*', async (c, next) => {
  const sessionId = await getSessionId(c.req.raw);
  if (!sessionId) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Store sessionId in variables for use in handlers
  c.set('sessionId', sessionId);
  await next();
});

// OAuth routes
app.get("/oauth/signin", async (c) => {
  return await signIn(c.req.raw);
});

app.get("/oauth/callback", async (c) => {
  const { response, sessionId } = await handleCallback(c.req.raw);
  if (sessionId) {
    c.set('sessionId', sessionId);
  }
  return response;
});

app.get("/oauth/signout", async (c) => {
  return await signOut(c.req.raw);
});

// Protected route checker
app.get("/protected-route", async (c) => {
  const sessionId = await getSessionId(c.req.raw);
  if (!sessionId) {
    return c.html(`
      <div class="mb-8 mx-auto text-center bg-yellow-100 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
        <span class="text-yellow-800">⚠️ You need to sign in to use this tool.</span>
        <div class="text-center bg-green-100 rounded-xl p-1">
          <a 
            href="/oauth/signin"
            class="ml-4 text-green-600 hover:text-green-800 underline"
          >Sign in with GitHub</a>
        </div>
      </div>
    `);
  }
  return c.html(`
    <div class="mb-8 mx-auto text-center bg-green-100 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
      <span class="text-green-800">✓ Signed in with GitHub</span>
      <div class="text-center bg-red-100 rounded-xl p-1">
        <a 
          href="/oauth/signout"
          class="ml-4 text-red-600 hover:text-red-800 underline"
        >Sign Out</a>
      </div>
    </div>
  `);
});

// Serve static files
app.use("/", serveStatic({ root: "./views", path: "index.html" }));
app.use(
  "/compare.html",
  serveStatic({ root: "./views", path: "compare.html" }),
);
app.use("/static/*", serveStatic({ root: "./views" }));

// Summarize privacy policy & handle user input
app.post("/api/summarize", async (c) => {
  const body = await c.req.parseBody();
  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyContent: string = String(body.policyContent);
    const modelSpeed: string = String(body.modelSpeed);

    const prompt: string = getSummaryPrompt(education, understanding, age);

    try {
      const summary: string = await Renderer.render(
        await getCompletion(prompt, policyContent, modelSpeed),
      );
      return c.text(summary);
    } catch (error) {
      console.error("Failed to get completion:", error);
      return c.text("Failed to get completion", 500);
    }
  }
  return c.text("Invalid request body", 400);
});

// Compare privacy policies
app.post("/api/compare", async (c) => {
  const body = await c.req.parseBody();
  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyContent1: string = String(body.policyContent1);
    const policyContent2: string = String(body.policyContent2);
    const modelSpeed: string = String(body.modelSpeed);

    const prompt: string = getComparisonPrompt(education, understanding, age);
    const policyContent: string = "First privacy policy:\n\n" + policyContent1 +
      "Second privacy policy:\n\n" + policyContent2;

    try {
      const comparison: string = await Renderer.render(
        await getCompletion(prompt, policyContent, modelSpeed),
      );
      return c.text(comparison);
    } catch (error) {
      console.error("Failed to get completion:", error);
      return c.text("Failed to get comparison", 500);
    }
  }
  return c.text("Invalid request body", 400);
});

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('An error occurred', 500);
});

// 404 handling
app.notFound((c) => {
  return c.text('Not found', 404);
});

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
