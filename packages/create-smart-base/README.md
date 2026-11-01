# create-smart-base

Create a Smart Base product with an interactive CLI.

## Requirements

- Node.js 22.22.2 or newer
- pnpm 10.32.1
- Network access to download dependencies

## Usage

```bash
npx create-smart-base@latest
```

Select Web, Mobile, or both with the arrow keys and Space, then press Enter and provide a project name. The CLI creates a new directory, installs dependencies, and formats the generated project. It will not overwrite an existing directory.

| Selection      | Included                                                        |
| -------------- | --------------------------------------------------------------- |
| Web            | Next.js app and server-only PostgreSQL/Drizzle database package |
| Mobile         | Expo Router app with NativeWind, without a backend              |
| Web and Mobile | Next.js, Expo, database package, and a minimal Hono API         |

The API provides `GET /health` only. Product routes, authentication, database access for the API, and deployment require product-specific work. For mobile, the build exports JavaScript bundles; native signing and store distribution require additional setup.

See the [repository](https://github.com/tranthaison1231/smart-base) for architecture, development, and release guidance.
