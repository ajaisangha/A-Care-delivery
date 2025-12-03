import React, { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showDialog, setShowDialog] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDialog(true);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Contact Us</h2>

      {/* SUCCESS DIALOG */}
      {showDialog && (
        <div className="contact-dialog-overlay">
          <div className="contact-dialog">
            <h5>Message Sent!</h5>
            <p>
              <strong>A+ Care Delivery</strong> will contact you within 
              <strong> 24 hours </strong>
              regarding your request.
            </p>

            <button
              className="btn btn-success w-100 mt-2"
              onClick={() => setShowDialog(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Send Message
        </button>
      </form>
    </div>
  );
}
