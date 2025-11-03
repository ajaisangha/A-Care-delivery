import React, { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { ZONES, RATES, VOLUME_DISCOUNTS } from "../rates";

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
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const destinationRef = useRef(null);
  const pickupRef = useRef(null);
  const mapRef = useRef(null);
  const directionsRendererRef = useRef(null);

  // Initialize map
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

  // Function to calculate route & estimate
  const calculateRoute = async () => {
    if (!serviceType || !destination) {
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

      // Render route on map
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(mapRef.current);
      }
      directionsRendererRef.current.setDirections(response);

      // Calculate distance
      let km = 0;
      response.routes[0].legs.forEach((leg) => {
        km += leg.distance.value;
      });
      km = km / 1000;

      if (km > 15) {
        setEstimate(null);
        setErrorMsg("Distance more than 15km, please contact us for a quote.");
        setLoading(false);
        return;
      }

      // Zone & rate calculation
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
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not calculate distance. Please check addresses.");
      setEstimate(null);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic update whenever addresses, pickup, or serviceType change
  useEffect(() => {
    if (destination) {
      calculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, pickupAddress, pickup, serviceType, quantity]);

  const handleClear = () => {
    setServiceType("");
    setDestination("");
    setQuantity(1);
    setPickup(false);
    setPickupAddress("");
    setEstimate(null);
    setErrorMsg("");

    if (destinationRef.current?.getPlace) {
      destinationRef.current.set("place", null);
      document.querySelector('input[placeholder="Enter destination"]').value = "";
    }
    if (pickupRef.current?.getPlace) {
      pickupRef.current.set("place", null);
      document.querySelector('input[placeholder="Enter pickup address"]').value = "";
    }

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Delivery Cost Estimator</h2>

      <div className="row">
        {/* Form Left */}
        <div className="col-lg-6 mb-4">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3">
              <label className="form-label fw-bold">Service Type</label>
              <select
                className="form-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="">Select service</option>
                <option value="florist">Florist Delivery</option>
                <option value="pharmacy">Pharmacy Delivery</option>
                <option value="retail">Retail Delivery</option>
                <option value="sameday">Same-Day Delivery</option>
              </select>
            </div>

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
                />
              </Autocomplete>
            </div>

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
                  />
                </Autocomplete>
              </div>
            )}

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary flex-grow-1"
                disabled={loading}
                onClick={calculateRoute}
              >
                {loading ? "Calculating..." : "Calculate Estimate"}
              </button>
              <button
                type="button"
                className="btn btn-secondary flex-grow-1"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Map + Estimate Right */}
        <div className="col-lg-6">
          {estimate && !errorMsg && (
            <div className="alert alert-success text-center mb-3">
              <strong>Estimated Delivery Cost:</strong> ${estimate}
            </div>
          )}
          <div
            id="map"
            style={{
              width: "100%",
              height: "280px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
