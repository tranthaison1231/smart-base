# API client

`fetchJson` ở `apps/web/src/_shared/api/fetch-json.ts` là helper phía client/server để gọi HTTP JSON, kiểm tra response bằng `schema.parse` và chuyển lỗi HTTP/JSON/schema thành thông báo caller cung cấp.

```ts
import { fetchJson } from "@/_shared/api/fetch-json"
import { z } from "zod"

const UserSchema = z.object({ id: z.string(), name: z.string() })

const user = await fetchJson({
  url: "/api/users/123",
  schema: UserSchema,
  errorMessage: "Không thể tải người dùng",
})
// user được suy ra là { id: string; name: string }
```

Options: `method` (`GET` mặc định, `POST`, `PUT`), `body`, `fetchImpl` (inject khi test), `signal`, `cache`, và `acceptResponse` cho status đặc biệt mà endpoint chủ ý trả JSON. Body tự được JSON.stringify và thêm content-type. Helper mặc định áp dụng timeout 5 giây; nếu có `signal`, timeout được kết hợp với tín hiệu hủy của caller.

Non-2xx, JSON sai định dạng hoặc schema không hợp lệ đều ném `Error(errorMessage)` để không làm lộ payload upstream. Lỗi mạng/abort từ `fetch` được giữ nguyên. Endpoint xử lý status hợp lệ khác 2xx cần khai báo `acceptResponse` rõ ràng.

Đặt schema gần contract sở hữu nó; validate ở ranh giới nhận dữ liệu. Không dùng type assertion để thay cho kiểm tra runtime. Route xử lý secret hoặc dữ liệu nhạy cảm phải kiểm tra quyền ở server; helper này không tự thêm authentication, retry hay logging.

