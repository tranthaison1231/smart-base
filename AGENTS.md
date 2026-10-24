# Hướng dẫn cho agent

Smart Base là starter trung lập, chưa có domain sản phẩm. Đọc [trạng thái dự án](.codex/project-state.md) và [tài liệu Codex](docs/codex.md) trước thay đổi lớn.

- Giữ đúng chiều phụ thuộc FSD: layer cao chỉ import layer thấp hơn. `app/` chỉ điều phối route và layout; không đặt nghiệp vụ tại đây.
- Thêm UI dùng chung vào `apps/web/src/_shared/ui` chỉ khi nó không phụ thuộc domain. Kiểm tra component hiện có trước khi tạo cái mới.
- Gọi API ngoài từ server-side code; kiểm tra response ở trust boundary bằng schema. Không đưa credential vào client.
- AI service là server-only. Trước khi tạo route công khai cần có authentication, rate limiting và giới hạn ngân sách.
- Khi thêm hành vi, viết test hồi quy; trước khi hoàn tất chạy `pnpm lint`, `pnpm typecheck`, `pnpm test` và `pnpm build` phù hợp với phạm vi.
- Không thêm nghiệp vụ, env var, dependency hay abstraction “để sau” nếu feature hiện tại chưa cần.
- Nếu repo có `.codegraph/`, dùng CodeGraph để lần theo symbol/call path trước khi grep hoặc đọc nhiều file. Không tự khởi tạo index.
- Đọc skill [feature-development](.agents/skills/feature-development/SKILL.md) khi thêm luồng sản phẩm mới.

