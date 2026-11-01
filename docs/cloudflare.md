# Cloudflare development

The app uses the beta Cloudflare CLI and Vite integration with `cloudflare.config.ts`. Install dependencies with Bun and use Node.js for the CLI. The generated types are in `.cloudflare/types/index.d.ts`; local Cloudflare state and build output also live under `.cloudflare/` and are ignored by Git.

| Command | Action |
| --- | --- |
| `just setup` | Install dependencies and generate types. |
| `just start` | Start the local app on port 3000. |
| `just check` | Apply Bun lint and formatting fixes and check types. |
| `just build` | Build the Worker and static assets. |
| `just deploy` | Build and deploy the Worker. |
| `just environment=production deploy` | Use `.env.production` for the build and deployment commands. |

Just uses `.env` by default and `.env.<environment>` when `environment` is set. Values in the selected file override inherited variables. This selects configuration values, not a different Worker or domain. Cloudflare account and API credentials are supplied through the process environment or GitHub Actions.

The current app has no Worker secret bindings, so deployment does not upload the selected environment file. The CLI and Vite integration are beta. See [Cloudflare's migration guide](https://developers.cloudflare.com/cf/wrangler/migrate/).
