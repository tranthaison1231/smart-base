# Optional mobile app

Smart Base currently ships only a Next.js web app. Add an Expo app in a product copy when the product needs iOS or Android; Expo, mobile dependencies, and mobile CI are not included in the starter. Keep the web-only setup usable without a mobile toolchain.

For a product with both web and mobile, prefer a separate `apps/api` backend so both clients use a shared HTTP API. A product can document a reason to keep the API in Next.js initially. No API workspace is included; see [choosing a backend](architecture.md#choosing-a-backend) and [API deployment](deployment.md#deploy-a-separate-api-when-needed).

## Add Expo to a product

1. Review the current [Expo monorepo guide](https://docs.expo.dev/guides/monorepos/) and [Expo Router guide](https://docs.expo.dev/router/introduction/). Choose an Expo SDK compatible with the product's React Native, React, Node, and pnpm versions. Follow Expo's current project creation instructions to create `apps/mobile` in the copied product; the existing `apps/*` workspace glob already covers it. Do not copy the example as a product feature.
2. Give mobile its own package name, scripts, dependencies, TypeScript and lint configuration, and tests. Add explicit root commands for web and mobile as needed: the starter's root `pnpm dev` and `pnpm build` run web only. Configure Turbo and CI for the mobile checks actually supported by the project; do not treat a web build as a native build.
3. Start Expo using the new workspace's development script. Check the product on an Android emulator and iOS simulator or supported physical devices as available. Use a development build when the app needs native capabilities unavailable in Expo Go. Document the commands and prerequisites that were actually verified.
4. Configure [EAS Build](https://docs.expo.dev/build/setup/) or another release process only when preparing a real mobile app. Set the app identifiers, signing, build profiles, and environment-specific configuration for that product. Follow current Apple and Google store requirements before release.

## Mobile styling

Use [NativeWind](https://www.nativewind.dev/docs/getting-started/installation) as the preferred styling approach when an Expo app is added. Install and configure it in the mobile workspace for the chosen Expo SDK; it is not installed in this starter. NativeWind provides styling rather than a complete UI kit, so add native components only when the product needs them.

At the time of writing, stable NativeWind v4 uses Tailwind CSS v3 while the web app uses Tailwind CSS v4. NativeWind v5 supports Tailwind CSS v4 but is a pre-release that its maintainers do not recommend for production. Check the current stable release and compatibility when adding mobile, keep each app's dependencies and configuration appropriate to its version, and do not assume the web Tailwind configuration can be reused unchanged. Verify styles, themes, and interactions on both iOS and Android.

## Boundaries and shared code

- Keep web UI and routing in `apps/web` and native UI and navigation in `apps/mobile`. Existing web components use web-specific dependencies and are not native UI components.
- Keep database connections, server-only AI code, private credentials, and privileged operations on trusted servers. Never import `@smart-base/database` into mobile.
- Use an HTTPS server API when both apps need server-owned business behavior. Authenticate each request, authorize the operation and resource, validate input and responses at trust boundaries, and test success and denied access. A mobile access token is not itself proof of authorization.
- Extract types, Zod schemas, or pure business rules into a shared package only when both apps have a real consumer. A shared package must not import platform-specific or server-only code; see [shared package guidance](../packages/README.md).
- Mobile configuration prefixed `EXPO_PUBLIC_` is embedded in the app and is public. Never put a database URL, secret key, or service-role key there; keep only intended public configuration and document the variables a product actually uses.

## Supabase when needed

Supabase is optional. A product can use its PostgreSQL with the existing Drizzle package while adding the Supabase SDK only for services it needs, such as Auth or Storage. See the [database guide](database.md#optional-supabase-postgresql).

For authentication, follow the current Supabase guides for [Next.js server-side clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs) and [Expo](https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native). Web cookie sessions and native session storage have different requirements; configure session persistence, refresh, sign-out, and any deep-link callbacks per platform. Use the intended publishable key only for client access and keep secret keys on trusted servers. Configure production email delivery when using email authentication.

Choose the authorization boundary for each feature. Requests to the Supabase Data API need appropriate grants and RLS policies, including for direct mobile access. A server using a privileged Drizzle connection may bypass RLS and must enforce authorization itself. Test both permitted and denied access for every path; do not assume that signing in alone protects data.

## Verification

For a real mobile workspace, add lint, typecheck, and behavior-focused tests to the root quality workflow. Apply the repository's 100% coverage contract to its runtime modules, with a Turbo-visible test script and a matching coverage provider. Test authentication/session failures and API authorization when those capabilities exist. Run the usual web checks as well as the mobile checks, and record whether an actual simulator, device, or native build was verified. See [testing guidance](testing.md).
