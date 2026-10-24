# Trạng thái dự án

## Mục tiêu

Smart Base là starter repo dùng để copy thành ứng dụng mới. Repo cung cấp Next.js, FSD, UI primitives, API JSON client, AI text service server-only và các quality gate cơ bản.

## Domain

Chưa có domain sản phẩm. Không mang logic hoặc dữ liệu từ Smart Stock, Smart Idea hay Smart Shop vào starter. Entity `ai` hiện tại là hạ tầng tích hợp, không phải domain sản phẩm.

## Runtime và kiểm tra

- Monorepo pnpm/Turborepo; web app tại `apps/web`.
- Node.js `>=20.18`, pnpm `10.32.1`.
- `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- AI cần `AI_API_KEY` và `AI_MODEL` khi gọi provider; không cần cho build/test.

## Quyết định khi copy

Đổi tên repo/package theo sản phẩm mới, thêm domain model và trạng thái sản phẩm vào file này, rồi cập nhật README và docs domain. Chỉ thêm package/workspace khi có code hoặc nhu cầu dùng chung thực sự.

