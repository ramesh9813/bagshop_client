import React from 'react'

const Features = () => {
  return (
    <div className="container py-5 my-5">
      <div className="text-center mb-5">
        <h6 className="text-warning fw-bold text-uppercase" style={{ letterSpacing: '2px' }}>What Makes Us Unique</h6>
        <h1 className="display-5 fw-bold">Premium Bag Features</h1>
        <div className="mx-auto bg-warning mt-3" style={{ height: '4px', width: '60px', borderRadius: '2px' }}></div>
      </div>
      
      <div className="row g-5 py-5">
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift transition-all">
            <div className="mx-auto bg-warning bg-opacity-10 text-warning d-inline-flex align-items-center justify-content-center fs-1 flex-shrink-0 mb-4 rounded-circle" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-shield-check"></i>
            </div>
            <h3 className="fw-bold mb-3">Superior Durability</h3>
            <p className="text-muted">All our bags are crafted with high-grade, water-resistant materials designed to withstand the toughest daily commutes and long journeys.</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift transition-all">
            <div className="mx-auto bg-warning bg-opacity-10 text-warning d-inline-flex align-items-center justify-content-center fs-1 flex-shrink-0 mb-4 rounded-circle" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-lightning-charge"></i>
            </div>
            <h3 className="fw-bold mb-3">Express Delivery</h3>
            <p className="text-muted">We prioritize your time. Get your favorite gear delivered to your doorstep within 1-2 days in Kathmandu and 3-5 days across Nepal.</p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift transition-all">
            <div className="mx-auto bg-warning bg-opacity-10 text-warning d-inline-flex align-items-center justify-content-center fs-1 flex-shrink-0 mb-4 rounded-circle" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-arrow-counterclockwise"></i>
            </div>
            <h3 className="fw-bold mb-3">7-Day Guarantee</h3>
            <p className="text-muted">Shopping is risk-free at BagShop. We offer a hassle-free 7-day return policy for any product that doesn't meet your expectations (no physical damage).</p>
          </div>
        </div>
      </div>

      <style>
        {`
          .hover-lift:hover {
            transform: translateY(-10px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
          }
          .transition-all {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  )
}

export default Features