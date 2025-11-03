import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="text-center py-5">
        <h1 className="fw-bold text-primary">Welcome to A+ Care Delivery</h1>
        <p className="lead text-muted mt-3">
          Reliable, compassionate, and professional delivery and caregiving
          services in Waterloo and surrounding areas.
        </p>

        {/* About Us */}
        <section className="my-5">
          <h2 className="fw-semibold text-center mb-4">Who We Are</h2>
          <p
            className="text-center text-secondary mx-auto"
            style={{ maxWidth: "800px" }}
          >
            At <strong>A+ Care Delivery</strong>, we believe in helping people live
            better, more independent lives. Whether it’s providing personal care,
            delivering essential goods, or helping with errands — we bring
            reliability, empathy, and a smile to every doorstep. Our team is
            dedicated to ensuring that every client receives personalized care
            that fits their unique needs.
          </p>
        </section>

        <Link to="/services" className="btn btn-primary btn-lg mt-3">
          Explore Our Services
        </Link>
      </section>
    </div>
  );
}
