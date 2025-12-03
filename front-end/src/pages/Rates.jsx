import React from "react";
import "./Rates.css";

export default function Rates() {
  const note =
    "📌 Note: The rates listed are approximate and do not include taxes, discounts, or any additional charges. Actual charges may vary based on specific circumstances.";

  const services = [
    {
      name: "Florist Delivery",
      pickup: [
        { label: "Single Bouquet", ranges: ["$14","$18","$22","$28","$38","$55"] },
        { label: "Premium Arrangement", ranges: ["$18","$22","$26","$32","$45","$65"] },
        { label: "Multiple Deliveries", ranges: ["$25","$32","$40","$50","$70","$100"] },
        { label: "Wedding/Event", ranges: ["$45+","$55+","$65+","$85+","$120+","$180+"] }
      ],
      dropoff: [
        { label: "Single Bouquet", ranges: ["$12","$15","$19","$24","$32","$47"] },
        { label: "Premium Arrangement", ranges: ["$15","$19","$22","$27","$38","$55"] },
        { label: "Multiple Deliveries", ranges: ["$21","$27","$34","$43","$60","$85"] },
        { label: "Wedding/Event", ranges: ["$38+","$47+","$55+","$72+","$102+","$153+"] }
      ]
    },
    {
      name: "Pharmacy Delivery",
      pickup: [
        { label: "Standard Delivery", ranges: ["$9","$12","$15","$20","$28","$42"] },
        { label: "Scheduled Route", ranges: ["$7","$9","$12","$16","$22","$35"] },
        { label: "Urgent Medication", ranges: ["$18","$22","$28","$38","$52","$75"] },
        { label: "Temperature Controlled", ranges: ["+$3","+$3","+$4","+$5","+$6","+$8"] }
      ],
      dropoff: [
        { label: "Standard Delivery", ranges: ["$8","$10","$13","$17","$24","$36"] },
        { label: "Scheduled Route", ranges: ["$6","$8","$10","$14","$19","$30"] },
        { label: "Urgent Medication", ranges: ["$15","$19","$24","$32","$44","$64"] },
        { label: "Temperature Controlled", ranges: ["+$3","+$3","+$4","+$5","+$6","+$8"] }
      ]
    },
    {
      name: "Retail & Parcel Delivery",
      pickup: [
        { label: "Small (<2kg)", ranges: ["$13","$17","$21","$27","$37","$52"] },
        { label: "Medium (2–10kg)", ranges: ["$17","$22","$27","$35","$48","$68"] },
        { label: "Large (10–20kg)", ranges: ["$24","$30","$36","$47","$65","$92"] },
        { label: "Extra Large (20kg+)", ranges: ["Quote","Quote","Quote","Quote","Quote","Quote"] }
      ],
      dropoff: [
        { label: "Small (<2kg)", ranges: ["$11","$14","$18","$23","$31","$44"] },
        { label: "Medium (2–10kg)", ranges: ["$14","$19","$23","$30","$41","$58"] },
        { label: "Large (10–20kg)", ranges: ["$20","$26","$31","$40","$55","$78"] },
        { label: "Extra Large (20kg+)", ranges: ["Quote","Quote","Quote","Quote","Quote","Quote"] }
      ]
    },
    {
      name: "Same-Day & Express Delivery",
      pickup: [
        { label: "Economy (by EOD)", ranges: ["$11","$14","$17","$22","$30","$45"] },
        { label: "Standard (4-hour)", ranges: ["$16","$20","$24","$32","$44","$65"] },
        { label: "Express (2-hour)", ranges: ["$25","$30","$35","$45","$62","$90"] },
        { label: "Rush (1-hour)", ranges: ["$35","$42","$49","$65","$85","$120"] }
      ],
      dropoff: [
        { label: "Economy (by EOD)", ranges: ["$9","$12","$14","$19","$26","$38"] },
        { label: "Standard (4-hour)", ranges: ["$14","$17","$20","$27","$37","$55"] },
        { label: "Express (2-hour)", ranges: ["$21","$26","$30","$38","$53","$77"] },
        { label: "Rush (1-hour)", ranges: ["$30","$36","$42","$55","$72","$102"] }
      ]
    },
  ];

  const kmRanges = ["0–5 km","5–10 km","10–15 km","15–50 km","50–100 km","100–200 km"];

  return (
    <div className="rates-page container py-5">
      <h2 className="text-center fw-bold mb-4">Delivery Rates</h2>

      <p className="text-center text-muted mb-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
        {note}
      </p>

      {services.map((service, idx) => (
        <div key={idx} className="card mb-5 rate-card shadow-sm">
          <div className="card-body">
            <h3 className="card-title fw-bold mb-4">{service.name}</h3>

            <div className="table-responsive mb-4">
              <table className="table table-striped table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Pickup & Drop-Off</th>
                    {kmRanges.map((range, i) => (
                      <th key={i}>{range}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {service.pickup.map((row, i) => (
                    <tr key={i}>
                      <td>{row.label}</td>
                      {row.ranges.map((price, j) => (
                        <td key={j}>{price}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-hover text-center">
                <thead className="table-secondary">
                  <tr>
                    <th>Drop-Off Only</th>
                    {kmRanges.map((range, i) => (
                      <th key={i}>{range}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {service.dropoff.map((row, i) => (
                    <tr key={i}>
                      <td>{row.label}</td>
                      {row.ranges.map((price, j) => (
                        <td key={j}>{price}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      <div style={{ height: "50px" }}></div> {/* Space between note and footer */}
    </div>
  );
}
