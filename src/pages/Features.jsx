import React from 'react'

const Features = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Our Features</h1>
      
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 rounded p-3">
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Durability</h3>
            <p>All our bags are crafted with high-grade, water-resistant materials designed to withstand the toughest conditions.</p>
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 rounded p-3">
            <i className="bi bi-truck"></i>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Fast Delivery</h3>
            <p>We offer expedited shipping options to ensure you get your gear exactly when you need it for your next trip.</p>
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3 rounded p-3">
            <i className="bi bi-arrow-repeat"></i>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Easy Returns</h3>
            <p>Not satisfied? No problem. Our hassle-free 30-day return policy makes shopping with us completely risk-free.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features