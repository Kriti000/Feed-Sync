import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! We'll reach you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #6f42c1 0%, #007bff 100%)",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <h1 className="text-center fw-bold mb-4">📞 Contact Us</h1>
        <p className="text-center mb-5">
          At FeedSync, your feedback matters just as much as the ones you collect.
        </p>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card p-4 shadow-lg text-dark">
              <h4 className="fw-bold">Get in Touch</h4>
              <p>
                📍 <strong>Address:</strong> Noida, Uttar Pradesh, India
              </p>
              <p>
                📧 <strong>Email:</strong> support@feedsync.in
              </p>
              <p>
                📱 <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                🌐 <strong>Website:</strong> www.feedsync.in
              </p>
              <hr />
              <h5 className="fw-bold">Let’s Connect</h5>
              <p>
                🔗 LinkedIn | 🐦 Twitter | 📘 Facebook | 📷 Instagram
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-4 shadow-lg text-dark">
              <h4 className="fw-bold mb-3">Send Us a Message</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-warning w-100 fw-bold">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <p className="text-center mt-5">
          💡 At FeedSync, we believe meaningful connections begin with communication.
        </p>
      </div>
    </div>
  );
};

export default Contact;
