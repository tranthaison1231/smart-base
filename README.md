# Smart Base

Starter Next.js để copy thành sản phẩm mới. Base giữ lại cấu trúc Feature-Sliced Design (FSD), UI dùng chung, API client có kiểm tra schema, AI text service chỉ chạy server, cùng lint, typecheck và unit test. Không có nghiệp vụ Smart Stock, Smart Idea hay Smart Shop.

## Bắt đầu

Yêu cầu Node.js `>=22.22.2` và pnpm `10.32.1` (đã khóa trong `packageManager`).

```bash
pnpm install
pnpm dev
```

Mở `http://localhost:3000`. Không cần API key để chạy app, build hay test.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

`pnpm test:e2e` chạy browser smoke test bằng Chromium và tự khởi động app tại port `3100`. Nếu Chromium chưa được cài, chạy `pnpm --filter @smart-base/web exec playwright install chromium`.

## Bắt đầu thêm sản phẩm

1. Đọc [hướng dẫn kiến trúc](docs/architecture.md) rồi xác định route, page, widget, feature hoặc entity.
2. Đọc [Codex workflow](docs/codex.md) và skill [feature-development](.agents/skills/feature-development/SKILL.md).
3. Tạo domain model đầu tiên dưới `_entities`; không thêm domain giả vào starter.
4. Xem [UI components](docs/ui-components.md), [API](docs/api.md), [AI service](docs/ai-service.md), và [testing](docs/testing.md) trước khi thêm lớp tương ứng.

## Cấu trúc

```text
apps/web/src/
├── app/          # Next.js App Router, metadata, root layout, routes
├── _app/         # app providers và cấu hình cấp ứng dụng
├── _pages/       # màn hình gắn với route
├── _widgets/     # khối giao diện lớn kết hợp nhiều feature/entity
├── _features/    # hành động và luồng sử dụng của người dùng
├── _entities/    # model và dữ liệu thuộc domain; hiện có AI text service
└── _shared/      # UI, API client và tiện ích không phụ thuộc domain
```

Các layer được ESLint kiểm tra chiều import. Xem [architecture.md](docs/architecture.md) để biết ranh giới và ví dụ.

## Codex

`AGENTS.md` là entry point cho agent. `.codex/` chứa hướng dẫn làm việc và trạng thái starter; `.agents/skills/feature-development/` mô tả quy trình phát triển feature. Các thiết lập model, quyền duyệt và sandbox vẫn do người dùng quản lý.

