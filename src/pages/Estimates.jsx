import React, { useState, useRef } from "react";
import { LoadScript, Autocomplete, DistanceMatrixService } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";

const libraries = ["places"];

const BASE_ADDRESS = "378 Vogel Place, Waterloo, ON, Canada";

const getZoneIndex = (km) => {
  for (let i = 0; i < ZONES.length; i++) {
    if (km <= ZONES[i].maxKm) return i;
  }
  return 3;
};

export default function Estimates() {
  const [serviceType, setServiceType] = useState("");
  const [destination, setDestination] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pickup, setPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [calculateTrigger, setCalculateTrigger] = useState(false); // trigger DistanceMatrixService
  const [loading, setLoading] = useState(false);

  const destinationRef = useRef(null);
  const pickupRef = useRef(null);

  const API_KEY = "AIzaSyDjctUiqMfhtJNSCx8bMOg6-lz-IYohkhs";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setEstimate(null);
    setDistanceKm(null);

    if (!serviceType || !destination) {
      setErrorMsg("Please select service type and destination.");
      return;
    }

    setLoading(true);
    setCalculateTrigger(true); // trigger DistanceMatrixService
  };

  // This function calculates the total cost after getting distance
  const calculateEstimate = (km) => {
    setDistanceKm(km.toFixed(2));

    if (km > 15) {
      setErrorMsg("Distance more than 15km, please contact us for a quote.");
      setLoading(false);
      return;
    }

    const zoneIndex = getZoneIndex(km);

    let baseRate = 0;
    switch (serviceType) {
      case "florist":
        baseRate = RATES.florist.single[zoneIndex];
        break;
      case "pharmacy":
        baseRate = RATES.pharmacy.standard[zoneIndex];
        break;
      case "retail":
        baseRate = RATES.retail.small[zoneIndex];
        break;
      case "sameday":
        baseRate = RATES.sameday.economy[zoneIndex];
        break;
      default:
        baseRate = 0;
    }

    let totalRate = baseRate * quantity;

    if (pickup) totalRate += baseRate * 0.5;

    const discount = VOLUME_DISCOUNTS.find(
      (d) => quantity >= d.min && quantity <= d.max
    );
    if (discount) totalRate = totalRate * (1 - discount.discount);

    setEstimate(totalRate.toFixed(2));
    setLoading(false);
  };

  // Origins and destinations for DistanceMatrixService
  const origins = pickup && pickupAddress ? [BASE_ADDRESS, pickupAddress] : [BASE_ADDRESS];
  const destinations = [destination];

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <div className="container py-5">
        <h2 className="mb-4 text-center">Delivery Cost Estimator</h2>

        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px" }}>
          {/* Service Type */}
          <div className="mb-3">
            <label className="form-label fw-bold">Service Type</label>
            <select
              className="form-select"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              required
            >
              <option value="">Select service</option>
              <option value="florist">Florist Delivery</option>
              <option value="pharmacy">Pharmacy Delivery</option>
              <option value="retail">Retail Delivery</option>
              <option value="sameday">Same-Day Delivery</option>
            </select>
          </div>

          {/* Destination */}
          <div className="mb-3">
            <label className="form-label fw-bold">Destination Address</label>
            <Autocomplete
              onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
              onPlaceChanged={() => {
                const place = destinationRef.current.getPlace();
                setDestination(place?.formatted_address || "");
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Enter destination"
                required
              />
            </Autocomplete>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label className="form-label fw-bold">Quantity</label>
            <input
              type="number"
              min="1"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          {/* Pickup */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="pickup"
              checked={pickup}
              onChange={(e) => setPickup(e.target.checked)}
            />
            <label className="form-check-label fw-bold" htmlFor="pickup">
              Pickup required
            </label>
            <div className="form-text">Extra charges apply for pickup.</div>
          </div>

          {pickup && (
            <div className="mb-3">
              <label className="form-label fw-bold">Pickup Address</label>
              <Autocomplete
                onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = pickupRef.current.getPlace();
                  setPickupAddress(place?.formatted_address || "");
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter pickup address"
                  required={pickup}
                />
              </Autocomplete>
            </div>
          )}

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Calculating..." : "Calculate Estimate"}
          </button>
        </form>

        {distanceKm && !errorMsg && <div className="text-center mb-2">Distance: {distanceKm} km</div>}
        {estimate && !errorMsg && (
          <div className="alert alert-success text-center">
            <strong>Estimated Delivery Cost:</strong> ${estimate}
          </div>
        )}

        {/* DistanceMatrixService */}
        {calculateTrigger && destination && (
          <DistanceMatrixService
            options={{
              origins: [BASE_ADDRESS, ...(pickup && pickupAddress ? [pickupAddress] : [])],
              destinations: [destination],
              travelMode: "DRIVING",
            }}
            callback={(response, status) => {
              setCalculateTrigger(false);
              if (status === "OK") {
                let km = 0;
                if (pickup && pickupAddress) {
                  km = response.rows[1].elements[0].distance.value / 1000 + response.rows[0].elements[0].distance.value / 1000;
                } else {
                  km = response.rows[0].elements[0].distance.value / 1000;
                }
                calculateEstimate(km);
              } else {
                setErrorMsg("Could not calculate distance. Please check addresses.");
                setLoading(false);
              }
            }}
          />
        )}
      </div>
    </LoadScript>
  );
}
