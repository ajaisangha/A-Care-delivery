import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Booking.css";

export default function Booking() {
  const [deliveryOption, setDeliveryOption] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceOption, setServiceOption] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [destination, setDestination] = useState("");
  const [pickup, setPickup] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);
  const [createdID, setCreatedID] = useState("");

  const titleRef = useRef(null);
  const destinationRef = useRef(null);
  const pickupRef = useRef(null);

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
    if (pickup && !pickupAddress.trim()) return "Please enter pickup address.";
    if (!serviceType) return "Please select a service type.";
    if (!serviceOption) return "Please select a service option.";
    if (!quantity || quantity < 1) return "Please enter a valid quantity.";
    if (!destination.trim()) return "Please enter the destination address.";
    if (!deliveryDate) return "Please select a delivery date.";
    if (!deliveryTime) return "Please select a delivery time.";
    if (pickup && !pickupDate) return "Please select a pickup date.";
    if (pickup && !pickupTime) return "Please select a pickup time.";
    if (!customerName.trim()) return "Please enter your name.";
    if (!customerEmail.trim()) return "Please enter your email.";
    if (!customerPhone.trim()) return "Please enter your phone number.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // always scroll to top/title
    titleRef.current?.scrollIntoView({ behavior: "smooth" });

    const error = validateFields();
    if (error) {
      setErrorMsg(error);
      return;
    }

    setErrorMsg("");

    try {
      const docRef = await addDoc(collection(db, "delivery_requests"), {
        deliveryOption,
        serviceType,
        serviceOption,
        quantity,
        destination: destination.trim(),
        pickup,
        pickupAddress: pickupAddress.trim(),
        deliveryDate,
        deliveryTime,
        pickupDate,
        pickupTime,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        notes,
        createdAt: serverTimestamp()
      });

      setCreatedID(docRef.id);
      setSuccessDialog(true);
    } catch (err) {
      setErrorMsg("Error submitting booking. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <h2 ref={titleRef} className="mb-4 text-center">Book a Delivery</h2>

      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

      {successDialog && (
        <div className="success-dialog">
          <div className="dialog-box shadow-lg">
            <h3 className="fw-bold text-center mb-3">Request Submitted!</h3>
            <p className="text-center">
              Thank you, <strong>{customerName}</strong>.<br />
              Your delivery request has been submitted.
              <br />
              Our team will contact you within <strong>24 hours</strong>.
            </p>

            <p className="text-center mt-3">
              <strong>Delivery ID:</strong><br />
              <span className="delivery-id">{createdID}</span>
            </p>

            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {!successDialog && (
        <div className="row justify-content-center mt-3">
          <div className="col-lg-6 col-md-8">
            <form className="booking-form card p-4 shadow-sm" onSubmit={handleSubmit}>

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
                      <option key={i} value={opt}>{opt}</option>
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
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) ? 1 : val);
                  }}
                />
              </div>

              {/* Destination */}
              <div className="mb-3">
                <label className="form-label fw-bold">Destination Address</label>
                <Autocomplete
                  onLoad={(ac) => (destinationRef.current = ac)}
                  onPlaceChanged={() =>
                    setDestination(
                      destinationRef.current.getPlace()?.formatted_address || ""
                    )
                  }
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter destination"
                    defaultValue={destination}
                      onChange={(e) => setDestination(e.target.value)}

                  />
                </Autocomplete>
              </div>

              {/* Delivery Date & Time */}
              <div className="mb-3">
                <label className="form-label fw-bold">Delivery Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Delivery Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>

              {/* Pickup Fields */}
              {pickup && (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Pickup Address</label>
                    <Autocomplete
                      onLoad={(ac) => (pickupRef.current = ac)}
                      onPlaceChanged={() =>
                        setPickupAddress(
                          pickupRef.current.getPlace()?.formatted_address || ""
                        )
                      }
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter pickup address"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                      />
                    </Autocomplete>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Pickup Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Pickup Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Customer Info */}
              <div className="mb-3">
                <label className="form-label fw-bold">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Additional Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success w-100 mt-3">
                Submit Booking
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
