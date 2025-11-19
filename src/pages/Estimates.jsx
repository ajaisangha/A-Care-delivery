import React, { useState, useRef, useEffect } from "react";
import { Autocomplete, GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";
import { Link } from "react-router-dom";

const BASE_ADDRESS = "378 Vogel Place, Waterloo, ON, Canada";
const GOOGLE_MAPS_API_KEY = "AIzaSyDjctUiqMfhtJNSCx8bMOg6-lz-IYohkhs";

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
  const [discountApplied, setDiscountApplied] = useState("None");
  const [errorMsg, setErrorMsg] = useState("");
  const [directions, setDirections] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);

  const destinationRef = useRef(null);
  const pickupRef = useRef(null);
  const titleRef = useRef(null);

  const mapCenter = { lat: 43.4683, lng: -80.5204 };

  // Scroll to title whenever result or error is updated
  useEffect(() => {
    if (estimate !== null || errorMsg) {
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [estimate, errorMsg]);

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
    if (pickup && !pickupAddress) return "Please enter a pickup address.";
    return null;
  };

  const calculateEstimate = async () => {
    const validationError = validateFields();
    if (validationError) {
      setErrorMsg(validationError);
      setEstimate(null);
      setDistanceKm(null);
      setDirections(null);
      setMarkerPos(null);
      setDiscountApplied("None");
      return;
    }

    setErrorMsg("");
    setEstimate(null);
    setDistanceKm(null);
    setDiscountApplied("None");
    setDirections(null);
    setMarkerPos(null);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const directionsService = new window.google.maps.DirectionsService();

      const destResults = await geocoder.geocode({ address: destination });
      if (!destResults.results[0]) throw new Error("Destination not found");
      const destLocation = destResults.results[0].geometry.location;

      let km = 0;

      if (deliveryOption === "dropOffOnly" || !pickup) {
        const baseResults = await geocoder.geocode({ address: BASE_ADDRESS });
        const baseLocation = baseResults.results[0].geometry.location;

        const result = await new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin: baseLocation,
              destination: destLocation,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (res, status) => (status === "OK" ? resolve(res) : reject(status))
          );
        });

        result.routes[0].legs.forEach(leg => (km += leg.distance.value));
        km /= 1000;
        setDistanceKm(km.toFixed(1));
        setMarkerPos(destLocation);
      } else {
        const pickupResults = await geocoder.geocode({ address: pickupAddress });
        const pickupLocation = pickupResults.results[0].geometry.location;

        const result = await new Promise((resolve, reject) => {
          directionsService.route(
            {
              origin: pickupLocation,
              destination: destLocation,
              travelMode: window.google.maps.TravelMode.DRIVING
            },
            (res, status) => (status === "OK" ? resolve(res) : reject(status))
          );
        });

        result.routes[0].legs.forEach(leg => (km += leg.distance.value));
        km /= 1000;
        setDistanceKm(km.toFixed(1));
        setDirections(result);
      }

      const zoneIndex = getZoneIndex(km);
      const rateType = pickup ? "pickupDropOff" : "dropOffOnly";
      const baseRate = RATES[serviceType][rateType][zoneIndex] || 0;

      let discountPercent = 0;
      for (let v of VOLUME_DISCOUNTS) {
        if (quantity >= v.min && quantity <= v.max) discountPercent = v.discount;
      }

      const totalRate = (baseRate * quantity * (1 - discountPercent)).toFixed(2);
      setEstimate(totalRate);
      setDiscountApplied(discountPercent > 0 ? `${discountPercent * 100}%` : "None");
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not calculate route. Please check addresses.");
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
    setMarkerPos(null);
    setDiscountApplied("None");

    if (destinationRef.current?.getPlace) {
      destinationRef.current.set("place", null);
      const destInput = document.querySelector('input[placeholder="Enter destination"]');
      if (destInput) destInput.value = "";
    }
    if (pickupRef.current?.getPlace) {
      pickupRef.current.set("place", null);
      const pickupInput = document.querySelector('input[placeholder="Enter pickup address"]');
      if (pickupInput) pickupInput.value = "";
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="container py-5">
      <h2 ref={titleRef} className="mb-4 text-center">Delivery Cost Estimator</h2>

      {/* Error Message */}
      {errorMsg && <div className="alert alert-danger mb-3 text-center">{errorMsg}</div>}

      {/* Result Alert */}
      {estimate && (
        <div className="alert alert-success mb-3 d-flex flex-column align-items-center">
          <div>
            Estimated Cost: <strong>${estimate}</strong> | Distance: <strong>{distanceKm} km</strong> | Discount: <strong>{discountApplied}</strong>
          </div>
          <Link to="/booking" className="btn btn-success btn-sm mt-2">Book Now</Link>
        </div>
      )}

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

        {/* Map */}
        <div className="col-lg-6 col-md-12 position-relative">
          <div className="map-card card shadow-sm">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "12px" }}
              center={mapCenter}
              zoom={12}
            >
              {markerPos && <Marker position={markerPos} />}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted fw-semibold">
          Estimated cost does not include taxes, discounts, or any additional charges.
        </p>
      </div>
    </div>
  );
}
