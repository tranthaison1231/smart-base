# AI text service

AI service là server-only tại `apps/web/src/_entities/ai`. Không import từ Client Component. Chỉ cần cấu hình env khi khởi tạo service; chạy dev/test/build không bắt buộc API key.

```dotenv
AI_API_KEY=...
AI_MODEL=...
# Tùy chọn: HTTPS, hoặc HTTP chỉ cho localhost/loopback.
# AI_BASE_URL=https://api.openai.com/v1
```

`AI_API_KEY` và `AI_MODEL` bắt buộc khi tạo service. `AI_BASE_URL` chỉ nhận HTTPS hoặc HTTP loopback, từ chối URL có credential. Lỗi cấu hình không in giá trị secret.

```ts
import { createConfiguredAiTextService } from "@/_entities/ai/index.server"

const ai = createConfiguredAiTextService()
const text = await ai.generateText({
  systemPrompt: "Trả lời ngắn gọn.",
  userPrompt: "Giải thích kết quả này.",
})
```

`generateText` nhận system/user prompt và `AbortSignal` tùy chọn (Route Handler có thể truyền `request.signal`); service áp timeout 25 giây, không retry, và chỉ trả nội dung dạng text. Có thể dùng `createAiTextService` với `AiTextModel` giả trong unit test. Không gọi provider thật từ test.

Starter chưa có AI API route. Trước khi đưa AI ra endpoint công khai, bổ sung authentication/authorization, rate limiting, giới hạn ngân sách và kiểm soát dữ liệu đầu vào/đầu ra ở server. Giữ API key ở server, không chuyển vào props, response hay biến `NEXT_PUBLIC_*`.

