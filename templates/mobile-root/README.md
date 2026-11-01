# Mobile product

This project contains an Expo Router mobile app styled with NativeWind in `apps/mobile`.

```bash
pnpm install
pnpm dev
```

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before handing off changes.
Configure native identifiers, signing, authentication, API access, and EAS only when the
product needs them. Public mobile configuration must never contain secrets.

`pnpm build` exports Android and iOS JavaScript bundles; it does not create signed native
apps. Test on the intended devices or simulators and configure a native build and release
process before distributing the app.
