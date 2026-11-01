# Create a product

Run the published CLI from the directory where you want to create the project:

Version `0.1.0` has been submitted to npm and is still being processed; it is not yet confirmed available for installation.

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

The [published package](https://www.npmjs.com/package/create-smart-base) is available as `create-smart-base`. Creating a local tarball does not publish it. Node.js `>=22.22.2`, pnpm `10.32.1`, and network access for dependency installation are required.

## Release the CLI

Before publishing, check the package name and version, and review the tarball contents. Run the repository quality checks, then test the tarball in a clean directory for Web, Mobile, and Web + Mobile. Package versions cannot be reused after publishing.

For the first release, sign in to npm with an account authorized for the package and 2FA enabled. From `packages/create-smart-base`, run `npm publish --access public`; its `prepack` script builds the templates from this checkout. Verify the published version with `npm view create-smart-base version` and run `npx create-smart-base@latest` in a clean directory.

For subsequent releases, update `packages/create-smart-base/package.json` to a new stable version, run the checks, and merge the release changes to `main`. After the first release, configure npm Trusted Publishing for `.github/workflows/publish-cli.yml` on the `tranthaison1231/smart-base` repository, with direct publishing allowed. The workflow must use the exact repository and workflow names configured on npm and run successfully within two days of creating the trusted publisher. See [npm's Trusted Publishing guide](https://docs.npmjs.com/trusted-publishers/).

Create and push a tag that matches the package version. For example, if its version is `0.1.1`:

```bash
git tag v0.1.1
git push origin v0.1.1
```

The tag must point to a commit reachable from `main`. A push to the tag starts the **Publish CLI** workflow, which checks the tag and version, runs the quality checks, and publishes through GitHub Actions OIDC. Ordinary branch pushes do not publish. The workflow only supports stable `X.Y.Z` versions; it does not publish prereleases.
