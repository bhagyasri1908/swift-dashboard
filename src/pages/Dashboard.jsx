import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem("searchTerm") || "");
  const [pageSize, setPageSize] = useState(() => Number(localStorage.getItem("pageSize")) || 10);
  const [currentPage, setCurrentPage] = useState(() => Number(localStorage.getItem("currentPage")) || 1);
  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem("sortConfig");
    return saved ? JSON.parse(saved) : { key: null, direction: null };
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/comments")
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("pageSize", pageSize);
    localStorage.setItem("currentPage", currentPage);
    localStorage.setItem("sortConfig", JSON.stringify(sortConfig));
  }, [searchTerm, pageSize, currentPage, sortConfig]);

  const filteredComments = comments.filter((comment) => {
    const term = searchTerm.toLowerCase();
    return (
      comment.name.toLowerCase().includes(term) ||
      comment.email.toLowerCase().includes(term) ||
      comment.body.toLowerCase().includes(term)
    );
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key || !direction) return 0;
    const valA = a[key].toString().toLowerCase();
    const valB = b[key].toString().toLowerCase();
    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = useMemo(() => Math.ceil(sortedComments.length / pageSize), [sortedComments, pageSize]);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedComments = sortedComments.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        if (prev.direction === "asc") return { key: columnKey, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key: columnKey, direction: "asc" };
    });
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key !== key) return "▲▼";
    return sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "▲▼";
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-number ${i === currentPage ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-area">
          <img src="/swift-logo.png" alt="Swift Logo" className="logo" />
        </div>
        <div className="profile-area">
          <div className="avatar">EH</div>
          <span className="user-name">Ervin Howell</span>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-controls">
          <button onClick={() => handleSort("postId")}>Sort Post ID {getSortSymbol("postId")}</button>
          <button onClick={() => handleSort("name")}>Sort Name {getSortSymbol("name")}</button>
          <button onClick={() => handleSort("email")}>Sort Email {getSortSymbol("email")}</button>
          <input
            type="text"
            placeholder="Search name, email, comment"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>PostID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {paginatedComments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.postId}</td>
                <td>{comment.name}</td>
                <td>{comment.email}</td>
                <td>{comment.body.slice(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="profile-styling">
         <button className="profile-button" onClick={() => navigate("/profile")}>
           View Profile
         </button>
        </div> 

        <div className="pagination-container">
            <div className="item-info">
    {startIndex + 1}-{Math.min(startIndex + pageSize, sortedComments.length)} of {sortedComments.length} items
  </div>
  <div className="pagination-controls">
    <button
      className="pagination-arrow"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      &lt;
    </button>

    <span className="page-number active">{currentPage}</span>
    {currentPage < totalPages && (
      <span
        className="page-number"
        onClick={() => setCurrentPage(currentPage + 1)}
        style={{ cursor: "pointer" }}
      >
        {currentPage + 1}
      </span>
    )}

    <button
      className="pagination-arrow"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      &gt;
    </button>

    <select
      className="items-per-page"
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
    >
      <option value={10}>10 / Page</option>
      <option value={25}>25 / Page</option>
      <option value={50}>50 / Page</option>
    </select>
  </div>
</div>

      </div>
    </div>
  );
}

export default Dashboard;
