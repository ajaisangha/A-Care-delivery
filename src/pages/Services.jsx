// src/pages/Services.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      id: "florist",
      title: "Florist Delivery",
      desc: "Delicate handling for floral arrangements with photo proof of delivery.",
      img: "https://images.pexels.com/photos/414645/pexels-photo-414645.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
    {
      id: "pharmacy",
      title: "Pharmacy Delivery",
      desc: "Fast and secure prescription delivery across Waterloo Region.",
      img: "https://images.pexels.com/photos/416825/pexels-photo-416825.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
    {
      id: "retail",
      title: "Retail Delivery",
      desc: "Reliable local store delivery of small and medium‑sized items.",
      img: "https://images.pexels.com/photos/3952940/pexels-photo-3952940.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
    {
      id: "sameday",
      title: "Same‑Day Courier",
      desc: "Express, standard or economy delivery for your urgent items.",
      img: "https://images.pexels.com/photos/51375/package-delivery-postman-postbox-51375.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Our Services</h2>
      <div className="row g-4">
        {services.map((s) => (
          <div key={s.id} className="col-md-6 col-lg-3">
            <div className="card h-100 shadow-sm">
              <img src={s.img} className="card-img-top" alt={s.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{s.title}</h5>
                <p className="card-text">{s.desc}</p>
                <div className="mt-auto text-end">
                  <Link
                    to={`/estimates?service=${s.id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Get Estimate →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
