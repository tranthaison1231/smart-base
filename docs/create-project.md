# Create a product

Run the published CLI from the directory where you want to create the project:

```bash
npx create-smart-base@latest
```

To run it from the Smart Base repository instead, install dependencies and run:

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

In a Web + Mobile product, run `pnpm dev` for web, `pnpm dev:mobile` for Expo, and `pnpm dev:api` for the API. The API exposes only `GET /health`; it does not provide product routes, authentication, or database access. See [mobile guidance](../templates/base/docs/mobile.md) and [backend guidance](../templates/base/docs/architecture.md#choosing-a-backend).

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

The [published package](https://www.npmjs.com/package/create-smart-base) is available as `create-smart-base`. Creating a local tarball does not publish it. Node.js `>=22.22.2`, pnpm `10.32.1`, and network access for dependency installation are required.

## Release the CLI

For a change that affects the CLI or any shipped template, run `pnpm changeset`, select `create-smart-base`, choose the appropriate patch, minor, or major bump, and commit the generated changeset with the change. Template changes need a changeset even when the CLI source did not change. Skip the changeset for repository-only changes that should not be released.

After changesets reach `main`, **Publish CLI** creates or updates a release PR with the version and changelog. Review and merge that PR; the next run executes the quality checks, packs the release, and publishes it through npm Trusted Publishing. A failed check prevents publication. The workflow can also retry an unpublished version on a later push to `main`. Package versions cannot be reused.

Before the first automated release:

1. In GitHub repository settings under **Actions → General**, allow GitHub Actions to create and approve pull requests. Repository rules may require additional approval of checks on a bot-created PR.
2. On npm, configure Trusted Publishing for `tranthaison1231/smart-base`, workflow `publish-cli.yml`, with direct `npm publish` allowed. The names must match exactly. A new trusted publisher expires if it does not publish successfully within two days. See [npm's Trusted Publishing guide](https://docs.npmjs.com/trusted-publishers/).
3. Merge a changeset into `main`, then review and merge the generated release PR. After publication, verify `npm view create-smart-base version` and run `npx create-smart-base@latest` in a clean directory.
