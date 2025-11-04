import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

export default function Services() {
  const services = [
    {
      name: "Florist Delivery",
      description:
        "From single bouquets to large wedding arrangements, A+ Care Delivery ensures every floral delivery arrives fresh, beautiful, and on time. Our professional drivers handle each order with exceptional care — perfect for florists, event planners, and customers who want their blooms delivered in perfect condition.",
      img: "https://assets.eflorist.com/assets/products/PHR_/T209-3A.jpg",
      details: [
        "✅ Full Service – We pick up from your shop and deliver directly to your customer.",
        "✅ Drop-Off Service – Bring your orders to our office and save on pickup cost.",
        "✅ Same-day coverage across Waterloo and nearby regions.",
      ],
    },
    {
      name: "Pharmacy & Prescription Delivery",
      description:
        "We specialize in safe, discreet, and timely prescription delivery. Partner with A+ Care Delivery for dependable pharmacy-to-patient services that ensure privacy and care. Perfect for pharmacies, clinics, and healthcare professionals.",
      img: "https://media.istockphoto.com/id/1469686707/photo/delivery-worker-hands-holding-medications-parcel.jpg?s=612x612&w=0&k=20&c=XwgJ2dcED8EClXuo-Ik24hbmF5P5SvFvJnETfw0LHzU=",
      details: [
        "✅ Full Service – Pickup from pharmacy, deliver directly to patient.",
        "✅ Drop-Off Service – Bring prescriptions to us for delivery.",
        "✅ Ideal for pharmacies, clinics, and care homes.",
      ],
    },
    {
      name: "Retail & Parcel Delivery",
      description:
        "We provide reliable retail and e-commerce delivery services for local stores and small businesses. Whether it's a single parcel or a daily batch, we make sure your customers receive their orders quickly and safely.",
      img: "https://www.track-pod.com/assets/Uploads/Blog/retail-deliveries/1__FitWzU2MCw3NTBd.webp",
      details: [
        "✅ Full Service – We pick up orders from your location and deliver to your customers.",
        "✅ Drop-Off Service – Drop parcels at our office for same-day delivery.",
        "✅ Affordable rates and business-friendly volume options.",
      ],
    },
    {
      name: "Same-Day & Express Delivery",
      description:
        "Need it there today? Our same-day delivery service ensures your parcels, documents, or urgent items are picked up and delivered on time — every time. Choose from flexible delivery speeds to match your urgency and budget.",
      img: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2644250/capsule_616x353.jpg?t=1700166663",
      details: [
        "✅ Full Service – We handle pickup and delivery within your area the same day.",
        "✅ Drop-Off Service – Bring your package to our office for instant dispatch.",
        "✅ Express, rush, and standard same-day options available.",
      ],
    },
  ];

  return (
    <div className="services-page container py-5">
      <h2 className="text-center fw-bold mb-4">Our Delivery Services</h2>
      <p
        className="text-center text-muted mb-5 mx-auto"
        style={{ maxWidth: "750px" }}
      >
        A+ Care Delivery provides professional and reliable courier services
        tailored for businesses and individuals. Whether it’s flowers,
        medication, retail parcels, or urgent deliveries, our team ensures every
        item arrives safely and on time.
      </p>

      {services.map((service, index) => (
        <div
          key={index}
          className={`row align-items-center mb-5 service-block ${
            index % 2 !== 0 ? "flex-row-reverse" : ""
          }`}
        >
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={service.img}
              alt={service.name}
              className="img-fluid rounded"
              style={{
                height: "100%",
                objectFit: "cover",
                width: "100%",
              }}
            />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-3">{service.name}</h3>
            <p className="text-muted">{service.description}</p>
            <ul className="list-unstyled mt-3 mb-4">
              {service.details.map((d, i) => (
                <li key={i} className="mb-2">
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/estimates" className="btn btn-primary">
              Get Estimate
            </Link>
          </div>
        </div>
      ))}

      <div className="text-center mt-5">
        <p className="text-secondary">
          📍 Based in Waterloo, ON — proudly serving Waterloo Region and nearby
          communities within 200 km.
        </p>
      </div>
    </div>
  );
}
