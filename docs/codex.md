# Codex và agent workflow

Codex đọc hướng dẫn theo thứ tự:

1. [`AGENTS.md`](../AGENTS.md): quy tắc bền vững của repository.
2. [`.codex/AGENT.md`](../.codex/AGENT.md): cách thực hiện thay đổi trong starter.
3. [`.codex/project-state.md`](../.codex/project-state.md): domain và trạng thái hiện tại.
4. [`.agents/skills/feature-development/SKILL.md`](../.agents/skills/feature-development/SKILL.md): quy trình khi thêm feature sản phẩm.

Trước một thay đổi, xác định layer sở hữu code, đọc module cùng test liên quan, ghi test trước cho hành vi mới, rồi chạy lint/typecheck/test/build phù hợp. Sau thay đổi cập nhật tài liệu nếu contract hoặc cấu trúc thay đổi. Xem thêm [testing](testing.md).

Repo cố ý không đặt model mặc định, approval policy, sandbox hoặc plugin marketplace. Những lựa chọn đó thuộc môi trường/user; không commit credential hoặc cấu hình cá nhân vào starter.

Khi copy starter cho sản phẩm mới, cập nhật `project-state.md`, `README.md` và domain docs trước khi yêu cầu agent làm feature đầu tiên.

