function SearchForm({ kw, onSearchChange, onClear }) {
  return (
    <label className="search-field">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <span className="sr-only">Tìm theo họ tên, tên đăng nhập hoặc email</span>
      <input
        type="search"
        value={kw}
        onChange={onSearchChange}
        placeholder="Tìm theo họ tên, tên đăng nhập hoặc email..."
      />
      {kw && (
        <button className="clear-search" type="button" onClick={onClear}>
          Xóa
        </button>
      )}
    </label>
  );
}

export default SearchForm;
