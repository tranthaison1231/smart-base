# Kiểm tra chất lượng

## Lệnh hiện có

```bash
pnpm lint       # ESLint, gồm FSD import boundaries
pnpm typecheck  # TypeScript strict, không emit
pnpm test       # Vitest unit/component tests
pnpm test:e2e   # Playwright browser smoke test trên Chromium
pnpm build      # Next.js production build
```

Để chạy một file khi phát triển:

```bash
pnpm --filter @smart-base/web exec vitest run src/_shared/api/fetch-json.test.ts
```

Unit test dùng Vitest, Testing Library và jsdom. Inject `fetchImpl`/AI model khi cần; không phụ thuộc mạng, secret, database hay provider thật. Test UI theo hành vi người dùng và semantics/accessibility thay vì chi tiết implementation.

Playwright tự khởi động Next dev server ở port `3100` và kiểm tra route `/`. Nếu Chromium chưa được cài trên máy, cài một lần:

```bash
pnpm --filter @smart-base/web exec playwright install chromium
```

## Khi thêm code

- Với thay đổi hành vi: thêm test hồi quy trước, quan sát test đỏ, rồi triển khai và chạy lại.
- Với component: kiểm tra tương tác chính, keyboard/accessibility và trạng thái rỗng hoặc lỗi nếu component sở hữu những trạng thái đó.
- Với ranh giới dữ liệu: test response hợp lệ và dữ liệu lỗi; không để lỗi lộ response nhạy cảm.
- Trước khi hoàn tất một feature: chạy lint, typecheck, unit test và production build.

Browser smoke test chỉ bao phủ app shell mặc định; feature mới cần thêm kịch bản browser tương ứng khi có tương tác quan trọng.

