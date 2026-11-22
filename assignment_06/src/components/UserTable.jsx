function UserTable({ users, onEdit, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">○</span>
        <p>Không tìm thấy người dùng phù hợp.</p>
        <span>Hãy thử từ khóa khác hoặc thêm người dùng mới.</span>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th><span className="sr-only">Thao tác</span></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-cell">
                  <span className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </div>
              </td>
              <td><span className="username">@{user.username}</span></td>
              <td><a className="email-link" href={`mailto:${user.email}`}>{user.email}</a></td>
              <td>{user.address?.street ?? user.address}</td>
              <td>{user.phone}</td>
              <td>
                <div className="row-actions">
                  <button className="icon-button edit-button" type="button" onClick={() => onEdit(user)} aria-label={`Sửa ${user.name}`}>
                    Sửa
                  </button>
                  <button className="icon-button delete-button" type="button" onClick={() => onDelete(user.id)} aria-label={`Xóa ${user.name}`}>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
