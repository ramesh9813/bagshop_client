import React from 'react'

const FAQs = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Frequently Asked Questions</h1>
      
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              What is the return policy?
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              <strong>We offer a 30-day return policy.</strong> If you are not completely satisfied with your purchase, you can return it within 30 days of receipt for a full refund or exchange, provided the item is unused and in its original packaging.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              How long does shipping take?
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Standard shipping typically takes <strong>3-5 business days</strong>. Expedited shipping options are available at checkout for faster delivery.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Do you ship internationally?
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Yes, we ship to select international destinations. Shipping costs and delivery times will vary based on your location.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQs