// src/pages/Rates.jsx
import React from "react";
import { Link } from "react-router-dom";
import { RATES, ZONES } from "../rates";

export default function Rates() {
  const zoneNames = ZONES.map((z) => z.name);

  const RateTable = ({ title, data, service }) => (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">{title}</h5>
          <Link to={`/estimates?service=${service}`} className="btn btn-sm btn-primary">
            Get Estimate →
          </Link>
        </div>
        <table className="table table-bordered table-sm mb-0">
          <thead>
            <tr>
              <th>Option</th>
              {zoneNames.slice(0, 3).map((z) => (
                <th key={z}>{z}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([option, rates]) => (
              <tr key={option}>
                <td className="text-capitalize">{option}</td>
                {rates.map((r, i) => (
                  <td key={i}>${r}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Rates by Service</h2>

      {/* Add a visual banner at top */}
      <div className="mb-5 text-center">
        <img
          src="https://images.pexels.com/photos/53610/delivery-van-parcel-courier-53610.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Delivery van"
          className="img-fluid rounded"
        />
      </div>

      <RateTable title="Florist Deliveries" data={RATES.florist} service="florist" />
      <RateTable title="Pharmacy Deliveries" data={RATES.pharmacy} service="pharmacy" />
      <RateTable title="Retail Deliveries" data={RATES.retail} service="retail" />
      <RateTable title="Same‑Day Deliveries" data={RATES.sameday} service="sameday" />

      <div className="alert alert-info mt-3">
        <strong>Note:</strong> Zone 4 (15+ km) deliveries require a custom quote.
      </div>
    </div>
  );
}
