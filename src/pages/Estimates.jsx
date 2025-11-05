import React, { useState, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";
import { Link } from "react-router-dom";
import { FaDollarSign, FaRoad, FaGift } from "react-icons/fa";
import "./Estimates.css";

const BASE_ADDRESS = "378 Vogel Place, Waterloo, ON, Canada";
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // replace with your API key

const getZoneIndex = (km) => {
  for (let i = 0; i < ZONES.length; i++) {
    if (km <= ZONES[i].maxKm) return i;
  }
  return ZONES.length - 1;
};

export default function Estimates() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });

  const [deliveryOption, setDeliveryOption] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceOption, setServiceOption] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("");
  const [pickup, setPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [estimate, setEstimate] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [discountApplied, setDiscountApplied] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [directions, setDirections] = useState(null);
  const [animateResult, setAnimateResult] = useState(false);

  const destinationRef = useRef(null);
  const pickupRef = useRef(null);

  const mapCenter = { lat: 43.4683, lng: -80.5204 };

  const getServiceOptions = () => {
    switch (serviceType) {
      case "florist": return ["Single Bouquet", "Premium Arrangement", "Multiple Deliveries", "Wedding/Event"];
      case "pharmacy": return ["Standard Delivery", "Scheduled Route", "Urgent Medication", "Temperature Controlled"];
      case "retail": return ["Small (<2kg)", "Medium (2–10kg)", "Large (10–20kg)", "Extra Large (20kg+)"];
      case "sameday": return ["Economy (by EOD)", "Standard (4-hour)", "Express (2-hour)", "Rush (1-hour)"];
      default: return [];
    }
  };

  const validateFields = () => {
    if (!deliveryOption) return "Please select a delivery option.";
    if (!serviceType) return "Please select a service type.";
    if (!serviceOption) return "Please select an option for the service.";
    if (!quantity || quantity < 1) return "Please enter a valid quantity.";
    if (!destination) return "Please enter the destination address.";
    if (deliveryOption === "pickupDropOff" && (!pickupAddress || pickupAddress.trim() === "")) return "Please enter pickup address.";
    return null;
  };

  const calculateEstimate = async () => {
    const validationError = validateFields();
    if (validationError) {
      setErrorMsg(validationError);
      setEstimate(null);
      setDistanceKm(null);
      setDiscountApplied(null);
      setDirections(null);
      return;
    }

    setErrorMsg("");
    try {
      const geocoder = new window.google.maps.Geocoder();
      const directionsService = new window.google.maps.DirectionsService();

      const destResults = await geocoder.geocode({ address: destination });
      const destLocation = destResults.results[0].geometry.location;

      let waypoints = [];
      let origin = null;

      if (deliveryOption === "pickupDropOff" && pickupAddress) {
        const pickupResults = await geocoder.geocode({ address: pickupAddress });
        const pickupLocation = pickupResults.results[0].geometry.location;
        waypoints.push({ location: pickupLocation, stopover: true });
        origin = pickupLocation;
      } else {
        origin = destLocation; // drop-off only
      }

      const result = deliveryOption === "pickupDropOff" ? 
        await new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin,
              destination: destLocation,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (res, status) => (status === "OK" ? resolve(res) : reject(status))
          );
        }) : null;

      setDirections(result);

      let km = 0;
      if (result) {
        result.routes[0].legs.forEach((leg) => (km += leg.distance.value));
        km /= 1000;
      } else {
        km = 1; // dummy minimal distance for drop-off only
      }

      setDistanceKm(km.toFixed(1));

      if (km > 200) {
        setEstimate(null);
        setErrorMsg("Distance exceeds 200 km. Please contact us for a quote.");
        return;
      }

      const zoneIndex = getZoneIndex(km);
      const rateType = pickup ? "pickupDropOff" : "dropOffOnly";
      const optionIndex = getServiceOptions().indexOf(serviceOption);
      const baseRate = RATES[serviceType][rateType][optionIndex];
      let totalRate = baseRate * quantity;

      // Calculate discount
      let discountPercent = 0;
      if (quantity >= 50) discountPercent = 0.2;
      else if (quantity >= 20) discountPercent = 0.15;
      else if (quantity >= 10) discountPercent = 0.1;

      setDiscountApplied(discountPercent * 100);
      totalRate *= (1 - discountPercent);

      setEstimate(totalRate.toFixed(2));

      // Animate result card
      setAnimateResult(false);
      setTimeout(() => setAnimateResult(true), 50);

      // Scroll to result card
      const resultCard = document.getElementById("estimateResultCard");
      if (resultCard) resultCard.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (err) {
      console.error(err);
      setErrorMsg("Could not calculate distance. Please check addresses.");
      setEstimate(null);
      setDistanceKm(null);
      setDiscountApplied(null);
      setDirections(null);
    }
  };

  const handleClear = () => {
    setDeliveryOption("");
    setServiceType("");
    setServiceOption("");
    setQuantity(1);
    setDestination("");
    setPickup(false);
    setPickupAddress("");
    setEstimate(null);
    setDistanceKm(null);
    setDiscountApplied(null);
    setErrorMsg("");
    setDirections(null);
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Map center and zoom logic
  let mapCenterAdjusted = mapCenter;
  let mapZoom = 12;
  if (directions) {
    const bounds = new window.google.maps.LatLngBounds();
    directions.routes[0].legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);
    });
    mapCenterAdjusted = bounds.getCenter();
    mapZoom = 12;
  } else if (destination) {
    // drop-off only
    mapCenterAdjusted = null;
    mapZoom = 12;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Delivery Cost Estimator</h2>

      <div className="row justify-content-center">
        {/* Form */}
        <div className="col-lg-4 col-md-6 mb-4">
          <form className="estimate-form card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label fw-bold">Delivery Option</label>
              <select
                className="form-select"
                value={deliveryOption}
                onChange={(e) => {
                  setDeliveryOption(e.target.value);
                  setPickup(e.target.value === "pickupDropOff");
                }}
              >
                <option value="">Select option</option>
                <option value="pickupDropOff">Pickup & Drop-Off</option>
                <option value="dropOffOnly">Drop-Off Only</option>
              </select>
            </div>

            {deliveryOption && (
              <div className="mb-3">
                <label className="form-label fw-bold">Service Type</label>
                <select
                  className="form-select"
                  value={serviceType}
                  onChange={(e) => { setServiceType(e.target.value); setServiceOption(""); }}
                >
                  <option value="">Select service</option>
                  <option value="florist">Florist Delivery</option>
                  <option value="pharmacy">Pharmacy Delivery</option>
                  <option value="retail">Retail Delivery</option>
                  <option value="sameday">Same-Day Delivery</option>
                </select>
              </div>
            )}

            {serviceType && (
              <div className="mb-3">
                <label className="form-label fw-bold">Option</label>
                <select
                  className="form-select"
                  value={serviceOption}
                  onChange={(e) => setServiceOption(e.target.value)}
                >
                  <option value="">Select option</option>
                  {getServiceOptions().map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}

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

            <div className="mb-3">
              <label className="form-label fw-bold">Destination Address</label>
              <Autocomplete
                onLoad={(ac) => (destinationRef.current = ac)}
                onPlaceChanged={() => setDestination(destinationRef.current.getPlace()?.formatted_address || "")}
              >
                <input type="text" className="form-control" placeholder="Enter destination" />
              </Autocomplete>
            </div>

            {pickup && (
              <div className="mb-3">
                <label className="form-label fw-bold">Pickup Address</label>
                <Autocomplete
                  onLoad={(ac) => (pickupRef.current = ac)}
                  onPlaceChanged={() => setPickupAddress(pickupRef.current.getPlace()?.formatted_address || "")}
                >
                  <input type="text" className="form-control" placeholder="Enter pickup address" />
                </Autocomplete>
              </div>
            )}

            <div className="d-flex gap-2 mt-3">
              <button type="button" className="btn btn-primary flex-grow-1" onClick={calculateEstimate}>
                Calculate
              </button>
              <button type="button" className="btn btn-secondary flex-grow-1" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Map & Result */}
        <div className="col-lg-7 col-md-12">
          <div className="map-card card shadow-sm" style={{ position: "relative" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "450px", borderRadius: "12px" }}
              center={mapCenterAdjusted || mapCenter}
              zoom={mapZoom}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>

            {estimate && distanceKm && (
              <div
                id="estimateResultCard"
                className={`estimate-card ${animateResult ? "animate-popup" : ""}`}
                style={{ position: "absolute", top: "15px", left: "15px", width: "300px" }}
              >
                <h5>Estimate Details</h5>
                <div className="estimate-item"><FaDollarSign className="icon" /> <strong>Cost:</strong> ${estimate}</div>
                <div className="estimate-item"><FaRoad className="icon" /> <strong>Distance:</strong> {distanceKm} km</div>
                {discountApplied > 0 && (
                  <div className="estimate-item"><FaGift className="icon" /> <strong>Discount:</strong> {discountApplied}%</div>
                )}
                <div className="mt-3 text-center">
                  <Link to="/booking" className="btn btn-success estimate-btn">Book Now</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted fw-semibold">
          Estimated cost does not include taxes, discounts, or any additional charges.
        </p>
      </div>

      {errorMsg && <div className="alert alert-danger mt-4">{errorMsg}</div>}
    </div>
  );
}
