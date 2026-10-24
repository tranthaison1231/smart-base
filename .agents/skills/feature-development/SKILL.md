---
name: feature-development
description: Add or change a user-facing product feature in this starter, such as a workflow, page, or domain capability. Do not use for isolated UI primitives, dependency upgrades, or documentation-only changes.
---

# Phát triển feature

## Quy trình

1. Đọc `AGENTS.md`, `.codex/project-state.md` và `docs/architecture.md`. Tóm tắt hành vi người dùng, trạng thái/error/loading cần có và layer sở hữu feature.
2. Tìm module, component và test hiện có trước khi thêm file. Giữ route mỏng. Đặt composition ở page/widget, hành động trong feature, domain model/data contract trong entity, primitive dùng chung trong `_shared`.
3. Xác định trust boundary trước khi gọi dữ liệu: schema-validate dữ liệu nhận vào; giữ database query và mọi secret/provider credential ở server. Client có thể gọi public API không cần credential nếu CORS và chính sách dữ liệu cho phép. Thêm test thất bại cho hành vi mới trước khi triển khai.
4. Triển khai trong layer đã chọn; dùng `fetchJson`, UI primitives và dependency injection hiện có. Xử lý loading, empty, error và success ở nơi sở hữu workflow.
5. Chạy test liên quan, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Cập nhật docs nếu contract hoặc cấu trúc thay đổi và tóm tắt kết quả cùng kiểm tra chưa chạy.

## Tích hợp API/AI

- API ngoài có secret chỉ được gọi từ server code; response phải được xác thực trước khi đi vào domain/UI.
- Dùng AI service qua server-only export. Chỉ thêm route AI khi app đã có authentication/authorization, rate limiting, ngân sách và timeout/cancel phù hợp; nếu chưa có, hoãn route thay vì mở anonymous endpoint. Dùng fake model qua dependency injection trong test; không gọi provider thật. Không expose key hoặc upstream error/payload.

