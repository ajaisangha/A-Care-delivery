import React from "react";
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      name: "Florist Delivery",
      description:
        "Professional pickup and delivery of floral arrangements with care and photo confirmation.",
      img: "https://assets.eflorist.com/assets/products/PHR_/T209-3A.jpg",
    },
    {
      name: "Pharmacy Delivery",
      description:
        "Pickup and delivery of prescriptions with discreet packaging and temperature control.",
      img: "https://media.istockphoto.com/id/1469686707/photo/delivery-worker-hands-holding-medications-parcel.jpg?s=612x612&w=0&k=20&c=XwgJ2dcED8EClXuo-Ik24hbmF5P5SvFvJnETfw0LHzU=",
    },
    {
      name: "Retail Delivery",
      description:
        "Pickup and delivery of small to medium packages, including electronics, clothing, and more.",
      img: "https://www.track-pod.com/assets/Uploads/Blog/retail-deliveries/1__FitWzU2MCw3NTBd.webp",
    },
    {
      name: "Same-Day Delivery",
      description:
        "Fast local delivery for urgent documents, parcels, or gifts within hours.",
      img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2644250/capsule_616x353.jpg?t=1700166663",
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center">Our Services</h2>
      <div className="row g-4">
        {services.map((service, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="card h-100 shadow-sm">
              <img
                src={service.img}
                className="card-img-top"
                alt={service.name}
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <Link
                  to="/estimates"
                  className="btn btn-primary mt-auto"
                >
                  Get Estimate
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
