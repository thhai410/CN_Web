const fields = [
  { name: "name", label: "Họ và tên", placeholder: "Nguyễn Văn An", type: "text" },
  { name: "username", label: "Tên đăng nhập", placeholder: "nguyenvana", type: "text" },
  { name: "email", label: "Email", placeholder: "an@example.com", type: "email" },
  { name: "address", label: "Địa chỉ", placeholder: "Số nhà, đường, quận/huyện", type: "text" },
  { name: "phone", label: "Số điện thoại", placeholder: "+84 123 456 789", type: "tel" },
];

function AddUser({ newUser, onNewUserChange, onSubmit, onCancelEdit, isEditing }) {
  return (
    <form className="user-form" onSubmit={onSubmit}>
      {fields.map((field) => (
        <label className="field" key={field.name}>
          <span>{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            value={newUser[field.name]}
            onChange={onNewUserChange}
            placeholder={field.placeholder}
            required
          />
        </label>
      ))}
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          {isEditing ? "Lưu thay đổi" : "Thêm người dùng"}
        </button>
        {isEditing && (
          <button className="button button-secondary" type="button" onClick={onCancelEdit}>
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

export default AddUser;
