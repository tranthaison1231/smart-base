# Quy trình triển khai

- Bắt đầu bằng [project-state.md](project-state.md), hướng dẫn repo ở `AGENTS.md`, và test của module liên quan.
- Chọn layer theo `docs/architecture.md`; giữ route mỏng và không vượt FSD boundaries.
- Viết test hành vi trước khi thêm logic. Ưu tiên dependency injection đang có thay vì tạo mock infrastructure mới.
- Dùng `_shared/ui`, `fetchJson` và AI service hiện có nếu contract phù hợp. Không gọi dịch vụ AI/API có credential trong client.
- Giữ lỗi ở trust boundary dễ hiểu, không log hoặc trả secret/upstream payload.
- Sau thay đổi chạy các lệnh liên quan trong `docs/testing.md`; trước khi kết luận feature xong chạy quality gates đầy đủ.
- Cập nhật docs khi đổi đường dẫn, contract hoặc cách vận hành. Không tạo cấu hình model, approval hay sandbox của Codex trong repo.

