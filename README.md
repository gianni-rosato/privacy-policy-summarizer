# Privacy Policy Summarizer

Making privacy policies more accessible with generative AI

## Implementation

Features:

Other considerations:

## Installation

> Note: If using VSCode, it is important to install the
> [vscode_deno](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
> extension from the Extensions page in the text editor.
> ([deno docs](https://docs.deno.com/runtime/reference/vscode/))

Once the extension is installed, run the following command to interact with the
application as you are programming:

```bash
deno run --allow-net --allow-read --allow-env --watch main.ts
```

If completions aren't working, ensure you have a `.env` file formatted like so:

```ini
API_KEY=...
```

## Authentication Setup

This application uses GitHub OAuth for authentication. To set it up:

1. Go to GitHub.com and sign in
2. Navigate to Settings > Developer settings > OAuth Apps
3. Click "New OAuth App"
4. Fill in the application details:
   - Application name: "Privacy Policy Summarizer"
   - Homepage URL: `http://localhost:8000`
   - Authorization callback URL: `http://localhost:8000/oauth/callback`
5. Click "Register application"
6. Copy the Client ID
7. Generate and copy a new Client Secret
8. Create a `.env` file in the project root:
   ```ini
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
   ```

For production deployment, set these environment variables in your hosting
platform instead of using a `.env` file.

## Useful Resources

- Hono web framework documentation: https://hono.dev/docs/
- JSR for packages: https://jsr.io/
- Deno documentation: https://docs.deno.com/

## Privacy

By continuing, Google will share your name, email address, language preference, and profile picture with Privacy Policy Summarizer. See Privacy Policy Summarizer’s Privacy Policy and Terms of Service.
