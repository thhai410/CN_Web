import { useEffect, useMemo, useState } from "react";
import AddUser from "./components/AddUser.jsx";
import SearchForm from "./components/SearchForm.jsx";
import UserTable from "./components/UserTable.jsx";

const emptyUser = {
  name: "",
  username: "",
  email: "",
  address: "",
  phone: "",
};

function App() {
  const [users, setUsers] = useState([]);
  const [kw, setKw] = useState("");
  const [newUser, setNewUser] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setStatus("loading");
      setError("");

      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Máy chủ trả về mã ${response.status}.`);
        }

        const data = await response.json();
        setUsers(data);
        setStatus("success");
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setError(`Không thể tải danh sách người dùng. ${loadError.message}`);
        setStatus("error");
      }
    }

    loadUsers();
    return () => controller.abort();
  }, [loadAttempt]);

  const filteredUsers = useMemo(() => {
    const keyword = kw.trim().toLocaleLowerCase();
    if (!keyword) return users;

    return users.filter((user) =>
      [user.name, user.username, user.email]
        .some((value) => value?.toLocaleLowerCase().includes(keyword)),
    );
  }, [kw, users]);

  function handleNewUserChange(event) {
    const { name, value } = event.target;
    setNewUser((currentUser) => ({ ...currentUser, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editingId !== null) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingId
            ? {
                ...user,
                ...newUser,
                address: { ...user.address, street: newUser.address },
              }
            : user,
        ),
      );
      setEditingId(null);
    } else {
      setUsers((currentUsers) => [
        ...currentUsers,
        {
          ...newUser,
          id: crypto.randomUUID(),
          address: { street: newUser.address, suite: "", city: "" },
        },
      ]);
    }

    setNewUser(emptyUser);
  }

  function handleEdit(user) {
    setNewUser({
      name: user.name,
      username: user.username,
      email: user.email,
      address: user.address?.street ?? "",
      phone: user.phone,
    });
    setEditingId(user.id);
  }

  function handleDelete(userId) {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));

    if (editingId === userId) {
      setEditingId(null);
      setNewUser(emptyUser);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setNewUser(emptyUser);
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">U</div>
        <div>
          <p className="eyebrow">BÀI TẬP 06 · REACT</p>
          <h1>Quản lý người dùng</h1>
          <p className="subtitle">Theo dõi và cập nhật danh sách người dùng của bạn.</p>
        </div>
      </header>

      <section className="panel form-panel" aria-labelledby="form-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THÔNG TIN</p>
            <h2 id="form-heading">{editingId === null ? "Thêm người dùng" : "Cập nhật người dùng"}</h2>
          </div>
          <span className="step-badge">{editingId === null ? "01" : "02"}</span>
        </div>
        <AddUser
          newUser={newUser}
          onNewUserChange={handleNewUserChange}
          onSubmit={handleSubmit}
          onCancelEdit={handleCancelEdit}
          isEditing={editingId !== null}
        />
      </section>

      <section className="panel list-panel" aria-labelledby="list-heading">
        <div className="section-heading list-heading">
          <div>
            <p className="eyebrow">DANH BẠ</p>
            <h2 id="list-heading">Danh sách người dùng</h2>
          </div>
          <span className="count-badge">
            {filteredUsers.length} <span>người dùng</span>
          </span>
        </div>

        <SearchForm kw={kw} onSearchChange={(event) => setKw(event.target.value)} onClear={() => setKw("")} />

        {status === "loading" && (
          <p className="notice" role="status">Đang tải danh sách người dùng...</p>
        )}
        {status === "error" && (
          <div className="notice error-notice" role="alert">
            <span>{error}</span>
            <button className="text-button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
              Thử lại
            </button>
          </div>
        )}
        {(status === "success" || users.length > 0) && (
          <UserTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <p className="data-note">
          Dữ liệu ban đầu lấy từ JSONPlaceholder. Thay đổi được lưu trong phiên hiện tại trên trình duyệt.
        </p>
      </section>
      <footer className="page-footer">React CRUD · Thực hành quản lý dữ liệu với component và props</footer>
    </main>
  );
}

export default App;
