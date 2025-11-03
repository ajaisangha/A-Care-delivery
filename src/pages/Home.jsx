import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container my-5 pt-5">
      {/* Hero Section */}
      <section className="text-center my-5">
        <h1 className="fw-bold text-primary">Welcome to A+ Care Delivery</h1>
        <p className="lead text-muted mt-3">
          Reliable, compassionate, and professional delivery and caregiving
          services in Waterloo and surrounding areas.
        </p>
        <Link to="/services" className="btn btn-primary btn-lg mt-3">
          Explore Our Services
        </Link>
      </section>

      {/* About Us */}
      <section className="my-5">
        <h2 className="fw-semibold text-center mb-4">Who We Are</h2>
        <p className="text-center text-secondary mx-auto" style={{ maxWidth: "800px" }}>
          At <strong>A+ Care Delivery</strong>, we believe in helping people live
          better, more independent lives. Whether it’s providing personal care,
          delivering essential goods, or helping with errands — we bring
          reliability, empathy, and a smile to every doorstep. Our team is
          dedicated to ensuring that every client receives personalized care
          that fits their unique needs.
        </p>
      </section>

      {/* Services Overview */}
      <section className="my-5">
        <h2 className="fw-semibold text-center mb-4">Our Core Services</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* Service 1 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Personal Care Assistance</h5>
                <p className="card-text text-muted">
                  Compassionate in-home help for seniors and individuals with
                  mobility challenges — including bathing, dressing, grooming,
                  and companionship.
                </p>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Medication & Wellness Support</h5>
                <p className="card-text text-muted">
                  Assistance with medication reminders, light exercise, and
                  wellness checks to ensure your loved ones are safe and healthy.
                </p>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Errand & Grocery Delivery</h5>
                <p className="card-text text-muted">
                  Convenient pickup and delivery of groceries, prescriptions, and
                  essential items — so you can focus on what matters most.
                </p>
              </div>
            </div>
          </div>

          {/* Service 4 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Transportation Services</h5>
                <p className="card-text text-muted">
                  Safe and reliable rides for appointments, shopping, and local
                  errands. Punctual and friendly service you can count on.
                </p>
              </div>
            </div>
          </div>

          {/* Service 5 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Meal Delivery & Preparation</h5>
                <p className="card-text text-muted">
                  Freshly prepared meals or healthy deliveries customized to meet
                  dietary preferences and medical needs.
                </p>
              </div>
            </div>
          </div>

          {/* Service 6 */}
          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold">Specialized Care Visits</h5>
                <p className="card-text text-muted">
                  Personalized visits for seniors, post-surgery recovery, or
                  anyone needing friendly check-ins and professional attention.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5">
          <Link to="/rates" className="btn btn-outline-primary btn-lg me-3">
            View Service Rates
          </Link>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
