import React, { useEffect, useState } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";
import Swal from "sweetalert2";
import "./FetchData.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const FeedbackData = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
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
      text: "This feedback will be soft deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/feedback/soft-delete/${id}`);
        fetchData();
        Swal.fire("Deleted!", "Feedback has been soft deleted.", "success");
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete feedback", "error");
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowForm(true);
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
        ["IP Address", f.ipAddress || "N/A"],
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

    doc.save("Styled_Feedback_Report.pdf");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="first-div">
      {!showForm ? (
        <div className="second-div">
          <div className="header-bar">
            <h2>Feedback Data</h2>
            <div>
              <button className="add-button" onClick={() => {
                setEditUser(null);
                setShowForm(true);
              }}>
                + Add New
              </button>
              <button className="export-button" onClick={handleExportPDF}>
                Export Styled PDF
              </button>
            </div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by any keyword..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.rating}</td>
                  <td>{user.message}</td>
                  <td>
                    <button className="action-btn view-btn" onClick={() => handleView(user)}>
                      View
                    </button>
                    <button className="action-btn edit-btn" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className={`page-btn ${number === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <FeedbackForm
          editUser={editUser}
          setShowForm={setShowForm}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default FeedbackData;
