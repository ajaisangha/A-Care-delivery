import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Status() {
  const location = useLocation();
  const titleRef = useRef(null);

  const [deliveryId, setDeliveryId] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Autofill if navigated from Booking page
  useEffect(() => {
    if (location.state?.bookingId) {
      setDeliveryId(location.state.bookingId);
      fetchStatus(location.state.bookingId);
    }
  }, [location.state]);

  const fetchStatus = async (id) => {
    if (!id.trim()) {
      setErrorMsg("Please enter a valid Delivery ID.");
      return;
    }

    titleRef.current?.scrollIntoView({ behavior: "smooth" });

    setLoading(true);
    setErrorMsg("");
    setBookingData(null);

    try {
      const docRef = doc(db, "delivery_requests", id.trim());
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setErrorMsg("No booking found with this Delivery ID.");
      } else {
        setBookingData(docSnap.data());
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching booking status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 ref={titleRef} className="mb-4 text-center">
        Check Booking Status
      </h2>

      {errorMsg && (
        <div className="alert alert-danger text-center">{errorMsg}</div>
      )}

      {/* Search Form */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <label className="form-label fw-bold">Delivery ID</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter your Delivery ID"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
            />

            <button
              className="btn btn-primary w-100"
              onClick={() => fetchStatus(deliveryId)}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {bookingData && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card p-4 shadow-sm">
              <h4 className="fw-bold text-center mb-3">
                Delivery Status:{" "}
                <span className="text-success">
                  {bookingData.deliveryStatus}
                </span>
              </h4>

              <hr />

              <p><strong>Service Type:</strong> {bookingData.serviceType}</p>
              <p><strong>Service Option:</strong> {bookingData.serviceOption}</p>
              <p><strong>Quantity:</strong> {bookingData.quantity}</p>

              <p><strong>Destination:</strong> {bookingData.destination}</p>

              {bookingData.pickup && (
                <>
                  <p><strong>Pickup Address:</strong> {bookingData.pickupAddress}</p>
                  <p>
                    <strong>Pickup Date & Time:</strong>{" "}
                    {bookingData.pickupDate} at {bookingData.pickupTime}
                  </p>
                </>
              )}

              <p>
                <strong>Delivery Date & Time:</strong>{" "}
                {bookingData.deliveryDate} at {bookingData.deliveryTime}
              </p>

              <p><strong>Customer Name:</strong> {bookingData.customerName}</p>
              <p><strong>Email:</strong> {bookingData.customerEmail}</p>
              <p><strong>Phone:</strong> {bookingData.customerPhone}</p>

              {bookingData.notes && (
                <p><strong>Notes:</strong> {bookingData.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
