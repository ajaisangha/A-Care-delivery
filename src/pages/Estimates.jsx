import React, { useState, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";
import { Link } from "react-router-dom";

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
  const [errorMsg, setErrorMsg] = useState("");
  const [directions, setDirections] = useState(null);
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
    if (!pickup && deliveryOption === "pickupDropOff") return "Please enter pickup address.";
    if (!serviceType) return "Please select a service type.";
    if (!serviceOption) return "Please select an option for the service.";
    if (!quantity || quantity < 1) return "Please enter a valid quantity.";
    if (!destination) return "Please enter the destination address.";
    return null;
  };

  const calculateEstimate = async () => {
    const validationError = validateFields();
    if (validationError) {
      setErrorMsg(validationError);
      setEstimate(null);
      setDistanceKm(null);
      setDirections(null);
      return;
    }

    setErrorMsg("");
    try {
      const geocoder = new window.google.maps.Geocoder();
      const directionsService = new window.google.maps.DirectionsService();

      const baseResults = await geocoder.geocode({ address: BASE_ADDRESS });
      const baseLocation = baseResults.results[0].geometry.location;

      const destResults = await geocoder.geocode({ address: destination });
      const destLocation = destResults.results[0].geometry.location;

      let waypoints = [];
      if (pickup && pickupAddress) {
        const pickupResults = await geocoder.geocode({ address: pickupAddress });
        const pickupLocation = pickupResults.results[0].geometry.location;
        waypoints.push({ location: pickupLocation, stopover: true });
      }

      const result = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: baseLocation,
            destination: destLocation,
            waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING
          },
          (res, status) => (status === "OK" ? resolve(res) : reject(status))
        );
      });

      setDirections(result);

      let km = 0;
      result.routes[0].legs.forEach((leg) => (km += leg.distance.value));
      km /= 1000;
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

      const discount = VOLUME_DISCOUNTS.find((d) => quantity >= d.min && quantity <= d.max);
      if (discount) totalRate *= 1 - discount.discount;

      setEstimate(totalRate.toFixed(2));
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not calculate distance. Please check addresses.");
      setEstimate(null);
      setDistanceKm(null);
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
    setErrorMsg("");
    setDirections(null);
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

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
        <div className="col-lg-6 col-md-12">
          <div className="map-card card shadow-sm">
            <GoogleMap mapContainerStyle={{ width: "100%", height: "400px", borderRadius: "12px" }} center={mapCenter} zoom={12}>
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>

          {estimate && distanceKm && (
            <div className="estimate-card card p-4 shadow-sm text-center mt-3">
              <h5>Estimate Details</h5>
              <p><strong>Cost: </strong>${estimate}</p>
              <p><strong>Distance: </strong>{distanceKm} km</p>
              <p className="mt-3 fw-semibold">If you like the estimate:</p>
              <Link to="/booking" className="btn btn-success">Book Now</Link>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted fw-semibold">
          Note: Estimated cost does not include taxes, discounts, or any additional charges.
        </p>
      </div>

      {errorMsg && <div className="alert alert-danger mt-4">{errorMsg}</div>}
    </div>
  );
}
