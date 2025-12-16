import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Rates from "./pages/Rates";
import Estimates from "./pages/Estimates";
import Booking from "./pages/Booking";
import Status from "./pages/Status";
import "./App.css";

export default function App() {
  return (
    <div className="app-container d-flex flex-column">
      <NavBar />

      <main className="flex-grow-1 overflow-auto page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/estimates" element={<Estimates />} />
          <Route path="/status" element={<Status />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="footer text-center py-3">
        &copy; {new Date().getFullYear()} A+ Care Delivery — Vogel Pl, Waterloo
      </footer>
    </div>
  );
}
