import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "./Home.css"; // Use separate CSS file

export default function Home() {
  return (
    <div className="home-page">
      <Carousel fade interval={4000} indicators={false} className="home-carousel">
        <Carousel.Item>
          <div
            className="carousel-bg"
            style={{
              backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/015/540/944/non_2x/free-express-home-or-fast-delivery-service-by-van-car-with-stack-of-parcels-and-smartphone-with-mobile-app-for-online-delivery-tracking-flat-style-illustration-vector.jpg')`,
            }}
          >
            <div className="carousel-overlay text-center animate-text">
              <h1 className="carousel-title">
                Welcome to A+ Care Delivery
              </h1>
              <p className="carousel-text">
                Reliable, compassionate, and professional delivery services in Waterloo and surrounding areas.
              </p>
              <Link to="/services" className="btn btn-primary btn-lg mt-3">
                Explore Our Services
              </Link>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div
            className="carousel-bg"
            style={{
              backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/009/259/882/small/delivery-man-delivering-holding-parcel-box-to-customer-free-photo.jpg')`,
            }}
          >
            <div className="carousel-overlay text-center animate-text">
              <h2 className="carousel-title">Who We Are</h2>
              <p className="carousel-text mx-auto" style={{ maxWidth: "800px" }}>
                At <strong>A+ Care Delivery</strong>, we believe in helping people live
                better, more independent lives. Whether it’s providing personal care,
                delivering essential goods, or helping with errands — we bring
                reliability, empathy, and a smile to every doorstep. Our team is
                dedicated to ensuring that every client receives personalized care
                that fits their unique needs.
              </p>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
