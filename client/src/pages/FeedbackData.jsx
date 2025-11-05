import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./FetchData.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const FeedbackData = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/feedback", {
        withCredentials: true
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      Swal.fire('Error', 'Failed to fetch feedback data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.name} ${user.email} ${user.rating} ${user.message}`
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchText, users]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This feedback will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${id}`, {
          withCredentials: true
        });
        fetchData();
        Swal.fire("Deleted!", "Feedback has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete feedback", "error");
      }
    }
  };

  const handleView = (user) => {
    navigate(`/feedback/${user._id}`);
  };

  const toBase64 = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      return null;
    }
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    for (let i = 0; i < filteredUsers.length; i++) {
      const f = filteredUsers[i];
      let y = 20;

      doc.setFontSize(18).setTextColor(0, 76, 153).setFont("helvetica", "bold");
      doc.text("Feedback Report", pageWidth / 2, y, { align: "center" });
      y += 8;
      doc.setDrawColor(0, 0, 0).line(10, y, pageWidth - 10, y);
      y += 10;

      const entries = [
        ["Name", f.name],
        ["Email", f.email],
        ["Rating", String(f.rating)],
        ["Message", f.message],
      ];

      doc.setFontSize(12).setFont("helvetica", "normal");

      for (let [label, value] of entries) {
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value) || "-", 55, y);
        y += 10;
      }

      if (f.image) {
        const base64 = await toBase64(`http://localhost:5000/${f.image}`);
        if (base64) {
          doc.setFont("helvetica", "bold").text("Uploaded Image:", 15, y);
          y += 5;
          doc.addImage(base64, "JPEG", 15, y, 80, 60);
          y += 70;
        }
      }

      if (f.steps && f.steps.length > 0) {
        doc.setFont("helvetica", "bold").setFontSize(13).text("Step-wise Comments:", 15, y);
        y += 8;

        for (let j = 0; j < f.steps.length; j++) {
          const step = f.steps[j];
          doc.setFont("helvetica", "normal").setFontSize(11);
          doc.text(`Step ${j + 1}:`, 15, y);
          doc.text(step.comment || "-", 35, y);
          y += 8;

          if (step.image) {
            const stepBase64 = await toBase64(`http://localhost:5000/${step.image}`);
            if (stepBase64) {
              doc.addImage(stepBase64, "JPEG", 35, y, 80, 60);
              y += 70;
            }
          }

          if (y > 250 && j !== f.steps.length - 1) {
            doc.addPage();
            y = 20;
          }
        }
      }

      doc.setDrawColor(200).line(10, 280, pageWidth - 10, 280);
      doc.setFontSize(10).text(`Page ${i + 1}`, pageWidth - 30, 285);

      if (i !== filteredUsers.length - 1) {
        doc.addPage();
      }
    }

    doc.save("FeedSync_Feedback_Report.pdf");
    Swal.fire('Success!', 'PDF exported successfully', 'success');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading feedback data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-0">
                <i className="bi bi-table me-2 text-primary"></i>
                Feedback Data
              </h3>
              <small className="text-muted">Total Records: {filteredUsers.length}</small>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success"
                onClick={() => navigate('/feedback')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Feedback
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleExportPDF}
                disabled={filteredUsers.length === 0}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {/* Search Bar */}
          <div className="p-3 border-bottom">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, rating, or message..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && (
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchText('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Message</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user, index) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {user.rating} <i className="bi bi-star-fill"></i>
                        </span>
                      </td>
                      <td className="text-truncate" style={{maxWidth: '250px'}}>
                        {user.message}
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-info text-white me-1"
                          onClick={() => handleView(user)}
                          title="View Details"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No feedback found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-top">
              <nav>
                <ul className="pagination pagination-sm mb-0 justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackData;