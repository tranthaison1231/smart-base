# Kiến trúc

Smart Base dùng Next.js App Router cùng Feature-Sliced Design (FSD). Route là composition root mỏng; domain và luồng người dùng được đặt tại layer riêng để dễ thay đổi và kiểm thử.

## Layer và quyền sở hữu

| Layer | Đặt gì ở đây | Ví dụ hiện tại |
|---|---|---|
| `app/` | Route, metadata, root layout và kết nối page với URL | `apps/web/src/app` |
| `_app/` | Provider và logic composition cấp ứng dụng | Tạo khi app có provider riêng |
| `_pages/` | Nội dung màn hình theo route, kết hợp widget/feature/entity | Tạo theo page sản phẩm đầu tiên |
| `_widgets/` | Khối giao diện lớn, kết hợp nhiều layer thấp hơn | Tạo khi có composition cần tái sử dụng |
| `_features/` | Hành động/luồng người dùng có thể diễn đạt bằng động từ | Tạo theo nhu cầu sản phẩm |
| `_entities/` | Model, schema và thao tác dữ liệu gắn với domain | `apps/web/src/_entities/ai` |
| `_shared/` | UI, API client, lib không biết domain | `apps/web/src/_shared` |

Layer cao được phép import layer thấp hơn: `app → _pages → _widgets → _features → _entities → _shared`. Không import ngược hoặc đi ngang giữa các feature/entity. ESLint kiểm tra các ranh giới layer. `app/` là ngoại lệ thuộc Next.js và chỉ nên giữ kết nối route/layout.

Không tạo layer/package cho đến khi có mã dùng chung thật sự. Một module chỉ dùng ở một nơi có thể ở nơi sở hữu nó. Tên folder `_app`, `_pages`... giúp tránh va chạm với quy ước route của Next.js.

## Thêm feature

1. Route trong `app/` gọi page tương ứng; route không chứa truy vấn hay nghiệp vụ.
2. Page kết hợp widgets, features và entities, nhưng không sở hữu chúng.
3. Đặt hành động người dùng trong feature. Đặt schema/model/dữ liệu theo domain trong entity.
4. Tách code dùng chung sang `_shared` chỉ khi nó độc lập với domain.
5. Đặt test sát module. Test API/AI qua dependency injection hoặc mock; unit test không gọi dịch vụ thật.

Ví dụ một màn danh sách sản phẩm có thể có `app/products/page.tsx`, `_pages/products/ui/products-page.tsx`, `_widgets/product-list/`, `_features/search-products/`, `_entities/product/`, và dùng `_shared/ui/table`. Đây là ví dụ cấu trúc, chưa có nghiệp vụ này trong starter.

