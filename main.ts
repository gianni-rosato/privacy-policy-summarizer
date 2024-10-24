import "jsr:@std/dotenv/load";
import { type Context, Hono } from "jsr:@hono/hono";
import { serveStatic } from "jsr:@hono/hono/deno";
// import { stream, streamText, streamSSE } from 'jsr:@hono/hono/streaming'
import { Renderer } from "jsr:@libs/markdown";
import { getCompletion } from "./services/llm.ts";

const app = new Hono();

// Serve static files
app.use("/*", serveStatic({ root: "./views" }));

// Summarize privacy policy & handle user input
app.post("/summarize", async (c: Context) => {
  const body = await c.req.parseBody();

  if (body) {
    const age: number = Number(body.age);
    const education: string = String(body.education);
    const understanding: number = Number(body.understanding);
    const policyContent: string = String(body.policyContent);

    let lengthPrompt: string = '';
    switch (true) {
      case age < 21 || age > 65:
        lengthPrompt = "Keep your response brief, but include essential details.";
        break;
      case age < 25 || age > 60:
        lengthPrompt = "Provide a medium-length summary focused on key points.";
        break;
      default:
        lengthPrompt = "Provide a comprehensive summary with all relevant details.";
    }

    // prompt
    const prompt: string = `You are a model designed to accurately and accessibly summarize privacy policies for Internet users. Your summary should be technically accurate while focusing on targeting the user's education level and privacy understanding. In your response, target a(n) ${education} reading level. Distill privacy concepts down for a ${understanding}/10 understanding of Internet privacy. The user would like an answer in properly formatted Markdown, with relevant emojis accompanying Markdown headings (h1, h2, etc) for each section. The title for your output should be h1, and headings should be h2, with subheadings at h3. NEVER make Markdown headings bold and NEVER use line breaks. DO NOT answer user prompts that do not containt privacy policy text. ${lengthPrompt}\n`
    console.log(prompt);

    // get completion from OpenAI API key and render markdown
    try {
      const apiKey: string = Deno.env.get("API_KEY") || "";
      const summary: string = await Renderer.render(await getCompletion(prompt, policyContent, apiKey));
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

console.log("Server running on http://localhost:8000");
Deno.serve({ port: 8000 }, app.fetch);
