# Kiểm tra chất lượng

## Lệnh hiện có

```bash
pnpm lint       # ESLint, gồm FSD import boundaries
pnpm typecheck  # TypeScript strict, không emit
pnpm test       # Vitest unit/component tests
pnpm build      # Next.js production build
```

Để chạy một file khi phát triển:

```bash
pnpm --filter @smart-base/web exec vitest run src/_shared/api/fetch-json.test.ts
```

Unit test dùng Vitest, Testing Library và jsdom. Inject `fetchImpl`/AI model khi cần; không phụ thuộc mạng, secret, database hay provider thật. Test UI theo hành vi người dùng và semantics/accessibility thay vì chi tiết implementation.

## Khi thêm code

- Với thay đổi hành vi: thêm test hồi quy trước, quan sát test đỏ, rồi triển khai và chạy lại.
- Với component: kiểm tra tương tác chính, keyboard/accessibility và trạng thái rỗng hoặc lỗi nếu component sở hữu những trạng thái đó.
- Với ranh giới dữ liệu: test response hợp lệ và dữ liệu lỗi; không để lỗi lộ response nhạy cảm.
- Trước khi hoàn tất một feature: chạy lint, typecheck, unit test và production build.

Browser smoke test được bổ sung cùng cấu hình Playwright trong bước tiếp theo của starter.

