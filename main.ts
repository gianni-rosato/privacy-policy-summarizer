import "jsr:@std/dotenv/load";
import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
// import { stream, streamText, streamSSE } from 'jsr:@hono/hono/streaming'
import { Renderer } from "jsr:@libs/markdown";
import { getComparisonPrompt, getCompletion, getSummaryPrompt } from "./services/llm.ts";

const app = new Hono();

// Serve static files
app.use("/", serveStatic({ root: "./views", path: "index.html" }));
app.use("/compare.html", serveStatic({ root: "./views", path: "compare.html" }));
app.use("/static/*", serveStatic({ root: "./views" }));

// Summarize privacy policy & handle user input
app.post("/summarize", async (c: Context) => {
  const body = await c.req.parseBody();

  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyContent: string = String(body.policyContent);

    // prompt
    const prompt: string = getSummaryPrompt(education, understanding, age);

    // get completion from OpenAI API key and render markdown
    try {
      // const apiKey: string = Deno.env.get("API_KEY") || "";
      const summary: string = await Renderer.render(await getCompletion(prompt, policyContent));
      console.log(summary);
      return c.text(summary);
    } catch (error) {
      console.error('Failed to get completion:', error);
      return c.text("Failed to get completion");
    }

  } else {
    return c.text("Invalid request body", 400);
  }
});

// Compare privacy policies
app.post("/compare", async (c: Context) => {
  const body = await c.req.parseBody();

  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyContent1: string = String(body.policyContent1);
    const policyContent2: string = String(body.policyContent2);

    // comparison prompt
    const prompt: string = getComparisonPrompt(education, understanding, age);
    const policyContent: string = "First privacy policy:\n\n" + policyContent1 + "Second privacy policy:\n\n" + policyContent2;

    try {
      // const apiKey: string = Deno.env.get("API_KEY") || "";
      const comparison: string = await Renderer.render(await getCompletion(prompt, policyContent));
      return c.text(comparison);
    } catch (error) {
      console.error('Failed to get completion:', error);
      return c.text("Failed to get comparison");
    }
  } else {
    return c.text("Invalid request body", 400);
  }
});

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
