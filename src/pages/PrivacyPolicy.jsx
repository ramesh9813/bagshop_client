import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <h1 className="fw-bold mb-4"><i className="bi bi-shield-lock text-warning me-3"></i>Privacy Policy</h1>
            
            <p className="lead text-muted mb-5">
              Your privacy is important to us. It is BagShop's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">1. Information We Collect</h4>
              <p className="text-muted">
                We only ask for personal information when we truly need it to provide a service to you. 
                This includes your name, email address, shipping address, and phone number when you place an order or register an account.
              </p>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">2. How We Use Information</h4>
              <p className="text-muted">
                We use the information collected to process your orders, maintain your account, and provide you with updates about your purchases. 
                We also use it to improve our store and communicate promotional offers if you have opted in.
              </p>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">3. Data Security</h4>
              <p className="text-muted">
                We protect your data within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification. 
                All transaction data is handled through secure payment gateways like eSewa.
              </p>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold text-warning border-bottom pb-2">4. Third-Party Sharing</h4>
              <p className="text-muted">
                We do not share any personally identifying information with third-parties, except when required by law or to fulfill your shipping requests (e.g., sharing your address with delivery partners).
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

export default PrivacyPolicy;
