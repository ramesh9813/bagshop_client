import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <h1 className="fw-bold mb-4"><i className="bi bi-truck text-warning me-3"></i>Shipping & Return Policy</h1>
            
            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">1. Delivery Timeline</h4>
              <p className="text-muted">
                At BagShop, we strive to deliver your products as quickly as possible. 
                Standard delivery within Kathmandu Valley takes 1-2 business days. 
                Deliveries outside the valley usually take 3-5 business days depending on the location.
              </p>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">2. Shipping Charges</h4>
              <p className="text-muted">
                A flat shipping fee of NRS 100 is applied to all orders. We may offer free shipping during promotional periods or for orders above a certain threshold.
              </p>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-danger border-bottom pb-2">3. 7-Day Return Policy</h4>
              <p className="text-muted">
                We offer a <strong>7-Day Return Policy</strong> for all our bags. If you are not satisfied with your purchase, you can initiate a return request within 7 days of receiving the item.
              </p>
              <div className="alert alert-warning border-warning">
                <h6 className="fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Important Condition:</h6>
                <p className="mb-0 small">
                  The item must be in its original condition with no physical damage. All returns are subject to a <strong>manual inspection</strong> by our team. If any sign of wear, tear, or intentional damage is found, the return request will be rejected.
                </p>
              </div>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">4. Order Tracking</h4>
              <p className="text-muted">
                Once your order is shipped, you will receive a confirmation message. You can also view your order status in the "My Orders" section of your profile.
              </p>
            </section>

            <div className="text-center mt-4">
              <p className="small text-muted">Last Updated: December 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
