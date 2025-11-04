import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";
import { Link } from "react-router-dom";

const BASE_ADDRESS = "378 Vogel Place, Waterloo, ON, Canada";

const getZoneIndex = (km) => {
  for (let i = 0; i < ZONES.length; i++) {
    if (km <= ZONES[i].maxKm) return i;
  }
  return ZONES.length - 1;
};

export default function Estimates() {
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
  const [loading, setLoading] = useState(false);

  const destinationRef = useRef(null);
  const pickupRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const initializeMap = () => {
    if (!mapRef.current && window.google) {
      mapRef.current = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.4683, lng: -80.5204 },
        zoom: 12,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && !mapRef.current) {
        initializeMap();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getServiceOptions = () => {
    switch (serviceType) {
      case "florist":
        return ["Single Bouquet", "Premium Arrangement", "Multiple Deliveries", "Wedding/Event"];
      case "pharmacy":
        return ["Standard Delivery", "Scheduled Route", "Urgent Medication", "Temperature Controlled"];
      case "retail":
        return ["Small (<2kg)", "Medium (2–10kg)", "Large (10–20kg)", "Extra Large (20kg+)"];
      case "sameday":
        return ["Economy (by EOD)", "Standard (4-hour)", "Express (2-hour)", "Rush (1-hour)"];
      default:
        return [];
    }
  };

  const validateFields = () => {
    if (!deliveryOption) return "Please select a delivery option.";
    if (deliveryOption === "pickupDropOff" && pickup && !pickupAddress) return "Please enter pickup address.";
    if (!serviceType) return "Please select a service type.";
    if (!serviceOption) return "Please select an option for the service.";
    if (!quantity || quantity < 1) return "Please enter a valid quantity.";
    if (!destination) return "Please enter the destination address.";
    return null;
  };

  const calculateRoute = async () => {
    const validationError = validateFields();
    if (validationError) {
      setErrorMsg(validationError);
      setEstimate(null);
      return;
    }

    setErrorMsg("");
    setLoading(true);

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

      const response = await new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin: baseLocation,
            destination: destLocation,
            waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") resolve(result);
            else reject(status);
          }
        );
      });

      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(mapRef.current);
      }
      directionsRendererRef.current.setDirections(response);

      let km = 0;
      response.routes[0].legs.forEach((leg) => (km += leg.distance.value));
      km = km / 1000;
      setDistanceKm(km.toFixed(1));

      if (km > 200) {
        setEstimate(null);
        setErrorMsg("Distance exceeds 200 km. Please contact us for a quote.");
        setLoading(false);
        return;
      }

      const zoneIndex = getZoneIndex(km);

      let rateType = pickup ? "pickupDropOff" : "dropOffOnly";
      let serviceRates = RATES[serviceType][rateType];
      const optionIndex = getServiceOptions().indexOf(serviceOption);
      let baseRate = serviceRates[optionIndex];

      let totalRate = baseRate * quantity;

      const discount = VOLUME_DISCOUNTS.find((d) => quantity >= d.min && quantity <= d.max);
      if (discount) totalRate *= 1 - discount.discount;

      setEstimate(totalRate.toFixed(2));
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not calculate distance. Please check addresses.");
      setEstimate(null);
      setDistanceKm(null);
    } finally {
      setLoading(false);
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
    if (destinationRef.current?.getPlace) {
      destinationRef.current.set("place", null);
      document.querySelector('input[placeholder="Enter destination"]').value = "";
    }
    if (pickupRef.current?.getPlace) {
      pickupRef.current.set("place", null);
      document.querySelector('input[placeholder="Enter pickup address"]').value = "";
    }
    if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] });
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Delivery Cost Estimator</h2>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <form onSubmit={(e) => e.preventDefault()} className="estimate-form card p-4 shadow-sm">
            {/* Delivery Option */}
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

            {/* Service Type */}
            {deliveryOption && (
              <div className="mb-3">
                <label className="form-label fw-bold">Service Type</label>
                <select
                  className="form-select"
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    setServiceOption("");
                  }}
                >
                  <option value="">Select service</option>
                  <option value="florist">Florist Delivery</option>
                  <option value="pharmacy">Pharmacy Delivery</option>
                  <option value="retail">Retail Delivery</option>
                  <option value="sameday">Same-Day Delivery</option>
                </select>
              </div>
            )}

            {/* Service Option */}
            {serviceType && (
              <div className="mb-3">
                <label className="form-label fw-bold">Option</label>
                <select
                  className="form-select"
                  value={serviceOption}
                  onChange={(e) => setServiceOption(e.target.value)}
                >
                  <option value="">Select option</option>
                  {getServiceOptions().map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            {/* Destination */}
            <div className="mb-3">
              <label className="form-label fw-bold">Destination Address</label>
              <Autocomplete
                onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                onPlaceChanged={() =>
                  setDestination(destinationRef.current.getPlace()?.formatted_address || "")
                }
              >
                <input type="text" className="form-control" placeholder="Enter destination" />
              </Autocomplete>
            </div>

            {/* Pickup Address */}
            {pickup && (
              <div className="mb-3">
                <label className="form-label fw-bold">Pickup Address</label>
                <Autocomplete
                  onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
                  onPlaceChanged={() =>
                    setPickupAddress(pickupRef.current.getPlace()?.formatted_address || "")
                  }
                >
                  <input type="text" className="form-control" placeholder="Enter pickup address" />
                </Autocomplete>
              </div>
            )}

            <div className="d-flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={calculateRoute}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate Estimate"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
              <Link to="/booking" className="btn btn-success">
                Book Now
              </Link>
            </div>
          </form>
        </div>

        <div className="col-lg-6">
          {estimate && distanceKm && (
            <div className="estimate-card card p-4 shadow-sm mb-3">
              <h5>Estimate Details</h5>
              <p>
                <strong>Estimated Cost: </strong>${estimate}
              </p>
              <p>
                <strong>Distance: </strong>{distanceKm} km
              </p>
            </div>
          )}

          <div id="map" className="map-card card shadow-sm"></div>
        </div>
      </div>

      {/* Centered note */}
      <div className="text-center mt-4">
        <p className="text-muted fw-semibold">
          Note: Estimated cost does not include taxes, discounts, or any additional charges.
        </p>
      </div>

      {errorMsg && <div className="alert alert-danger mt-4">{errorMsg}</div>}
    </div>
  );
}
