# Báo cáo bài tập 06 — Ứng dụng CRUD với React

## 1. Mục tiêu và chức năng

Ứng dụng quản lý người dùng gồm các chức năng:

- Đọc danh sách ban đầu từ `https://jsonplaceholder.typicode.com/users`.
- Thêm, xem danh sách, sửa và xóa người dùng.
- Tìm kiếm theo họ tên, tên đăng nhập hoặc email.
- Hiển thị trạng thái đang tải, lỗi tải dữ liệu và cho phép thử tải lại.

Các thay đổi thêm/sửa/xóa chỉ được lưu trong state của ứng dụng ở trình duyệt; JSONPlaceholder chỉ cung cấp dữ liệu mẫu, ứng dụng không gửi thay đổi lên máy chủ.

## 2. Component Tree

```text
App
├── AddUser
│   └── Field (nhãn và ô nhập cho mỗi trường)
├── SearchForm
└── UserTable
    └── User row (một hàng cho mỗi người dùng)
```

`Field` và `User row` là phần tử được render trong component tương ứng, không phải component React riêng. `App` giữ state và kết nối các component con thông qua props và callback.

## 3. Luồng dữ liệu và State Lifting

```text
                    kw, setKw
SearchForm  ──onSearchChange──▶  App  ──kw──▶ lọc users ──users──▶ UserTable
                                      ▲                              │
                                      └──────────── onEdit ──────────┘

                    newUser, setNewUser
AddUser  ──onNewUserChange/onSubmit──▶ App ──newUser──▶ AddUser
                                           │
                                           ├── thêm/cập nhật ──▶ users
                                           └── onCancelEdit

UserTable ──onDelete──────────────────▶ App ──cập nhật users
```

- **`kw` đặt ở `App`:** giá trị tìm kiếm được nhập trong `SearchForm`, nhưng danh sách cần lọc (`users`) và kết quả được hiển thị trong `UserTable`. Đặt `kw` tại component cha chung giúp `App` lọc dữ liệu rồi truyền kết quả xuống bảng. Nếu để `kw` trong `SearchForm`, bảng không thể đọc trực tiếp state đó nếu không truyền ngược dữ liệu lên cha.
- **`newUser` đặt ở `App`:** `AddUser` hiển thị form nhưng `App` cần đọc dữ liệu khi thêm/cập nhật danh sách; `UserTable` còn có thể yêu cầu `App` nạp thông tin một người dùng vào form khi nhấn Sửa. Giữ state ở `App` cho phép hai component con phối hợp qua props/callback và tránh tạo state trùng lặp.

## 4. Props truyền từ App xuống component con

| Component | Prop | Kiểu / dữ liệu | Mục đích |
|---|---|---|---|
| `AddUser` | `newUser` | Object `{ name, username, email, address, phone }` | Giá trị hiện tại của form, bao gồm cả chế độ sửa. |
| `AddUser` | `onNewUserChange` | Hàm nhận sự kiện `change` | Cập nhật trường tương ứng trong state `newUser` của `App`. |
| `AddUser` | `onSubmit` | Hàm nhận sự kiện `submit` | Thêm người dùng hoặc lưu chỉnh sửa. |
| `AddUser` | `onCancelEdit` | Hàm | Hủy sửa và đưa form về trạng thái trống. |
| `AddUser` | `isEditing` | Boolean | Quyết định nhãn nút và trạng thái thêm/sửa. |
| `SearchForm` | `kw` | String | Giá trị từ khóa hiện tại. |
| `SearchForm` | `onSearchChange` | Hàm nhận sự kiện `change` | Cập nhật từ khóa trong `App`. |
| `SearchForm` | `onClear` | Hàm | Xóa từ khóa tìm kiếm. |
| `UserTable` | `users` | Mảng người dùng đã lọc | Dữ liệu hiển thị trong bảng. |
| `UserTable` | `onEdit` | Hàm nhận một người dùng | Yêu cầu `App` nạp người dùng vào form sửa. |
| `UserTable` | `onDelete` | Hàm nhận ID người dùng | Yêu cầu `App` xóa người dùng khỏi danh sách. |

## 5. Lỗi / Warning gặp phải và cách khắc phục

**Error:** `ReferenceError: React is not defined` khi trình duyệt render component `App`.

**Nguyên nhân:** Vite chưa được cấu hình plugin React nên JSX được xử lý theo kiểu runtime cổ điển, yêu cầu biến `React` có sẵn trong từng component. `App` dùng JSX nhưng không import `React`, vì vậy ứng dụng lỗi ngay khi render.

**Cách sửa:** Tạo `vite.config.js` và đăng ký `@vitejs/plugin-react` để bật JSX transform tự động. Sau khi cấu hình, trang render bình thường mà không cần thêm import React chỉ để dùng JSX.

## 6. Chạy ứng dụng

Yêu cầu Node.js và npm. Tại thư mục `assignment_06`:

```bash
npm install
npm run dev
```

Tạo bản dựng kiểm tra:

```bash
npm run build
```
