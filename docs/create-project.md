# Create a product

From the Smart Base repository, install dependencies and run:

```bash
pnpm install
pnpm create:app
```

The first prompt lets you select Web, Mobile, or both with Space; press Enter to confirm. Enter a lowercase project name containing letters, numbers, and hyphens. The CLI creates a new directory in the current working directory, runs `pnpm install`, and formats the result. It refuses to overwrite an existing directory. If installation or formatting fails, the generated directory remains; correct the problem and rerun the indicated command there.

| Selection      | Generated product                                                                       |
| -------------- | --------------------------------------------------------------------------------------- |
| Web            | The existing Next.js starter and server-only database package.                          |
| Mobile         | An Expo Router app with NativeWind. No backend is included.                             |
| Web and Mobile | The Next.js starter and database package, Expo app, and minimal Hono API in `apps/api`. |

In a Web + Mobile product, run `pnpm dev` for web, `pnpm dev:mobile` for Expo, and `pnpm dev:api` for the API. The API exposes only `GET /health`; it does not provide product routes, authentication, or database access. See [mobile guidance](mobile.md) and [backend guidance](architecture.md#choosing-a-backend).

The selected workspaces become part of the generated product; the CLI itself stays in this repository. Web products include the architecture, database, deployment, testing, and agent guides. A Mobile-only product has its own smaller README and agent instructions and does not include the web, API, or database workspaces.

Mobile uses Expo SDK 57 and NativeWind 4 with Tailwind CSS 3; the web app uses Tailwind CSS 4. The generated app must be tested on the intended iOS and Android devices or simulators before release. Configure identifiers, signing, EAS, authentication, and external services for a real product.

## Package for distribution

The CLI is a separate package, `packages/create-smart-base`; source templates live under `templates/`. Its `prepack` script bundles a snapshot so the package does not depend on this checkout. To produce an npm tarball locally:

```bash
pnpm --filter create-smart-base pack
```

To run the resulting tarball from another directory, use its absolute path:

```bash
npx --yes --package=/absolute/path/to/create-smart-base-0.1.0.tgz create-smart-base
```

The package has not been published to npm by this repository. After publishing to a registry under an available name, users can run `npx create-smart-base`. Creating the tarball does not publish it. Node.js `>=22.22.2`, pnpm `10.32.1`, and network access for dependency installation are required.
