import React from 'react'
import Accordion from 'react-bootstrap/Accordion'

const FAQs = () => {
  return (
    <div className="container py-5">
      <style>
        {`
          .faq-accordion .accordion-button:not(.collapsed) {
            background-color: #f8f9fa !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .faq-accordion .accordion-button:focus {
            border-color: #dee2e6 !important;
            box-shadow: none !important;
          }
          .faq-accordion .accordion-button {
            font-weight: 600;
          }
        `}
      </style>
      <h1 className="text-center mb-5 fw-bold">Frequently Asked Questions</h1>
      
      <Accordion defaultActiveKey="0" className="faq-accordion shadow-sm">
        {/* Existing & New Questions */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is the return policy?</Accordion.Header>
          <Accordion.Body>
            We offer a <strong>30-day return policy</strong>. If you are not completely satisfied, you can return it within 30 days for a full refund or exchange, provided the item is unused and in original packaging.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Can I return my bag within 7 days?</Accordion.Header>
          <Accordion.Body>
            Yes, absolutely! Since our policy covers up to 30 days, a return within 7 days is perfectly acceptable and will be processed immediately.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Is there any refund policy?</Accordion.Header>
          <Accordion.Body>
            Yes. Once we receive and inspect your returned item, we will process your refund. The money will be credited back to your original payment method or provided via store credit for COD orders.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>How long will it take to receive the product at my home?</Accordion.Header>
          <Accordion.Body>
            Standard shipping typically takes <strong>3-5 business days</strong> within the country. You will receive a tracking ID once your order is shipped.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>What are the keyboard shortcuts available?</Accordion.Header>
          <Accordion.Body>
            You can hold the <strong>Alt</strong> key anytime to see all shortcuts. Quick keys include:
            <ul>
              <li><strong>H</strong>: Homepage</li>
              <li><strong>P</strong>: Products Page</li>
              <li><strong>C</strong>: Cart / Clear Filters</li>
              <li><strong>/</strong>: Search Bar</li>
              <li><strong>S</strong>: My Orders</li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>Can I get a discount if I buy 10 or more items?</Accordion.Header>
          <Accordion.Body>
            Yes! We support bulk orders. If you are planning to buy 10 or more bags, please contact us through our <strong>Inquiry Form</strong> or email us directly. We offer competitive wholesale rates for large orders.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>Do you ship internationally?</Accordion.Header>
          <Accordion.Body>
            Yes, we ship to select international destinations. Shipping costs and delivery times will vary based on your specific location.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default FAQs