import React from 'react'

const Checkout = () => {
  return (
    <>
        <div className="container">
            <h2 className='text-center'>Payment detail</h2>
            <hr />
        <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required />
              <label class="form-check-label" for="credit">Credit card</label>
            </div>
            <div class="form-check">
              <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required />
              <label class="form-check-label" for="debit">Debit card</label>
            </div>
            <div class="form-check">
              <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required />
              <label class="form-check-label" for="paypal">PayPal</label>
            </div>
          </div>

        {/* name of the tag */}
          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-name" class="form-label">Name on card</label>
              <input type="text" class="form-control" id="cc-name" placeholder="" required />
              <small class="text-body-secondary">Full name as displayed on card</small>
              <div class="invalid-feedback">
                Name on card is required
              </div>
            </div>

            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-number" placeholder="" required />
              <div class="invalid-feedback">
                Credit card number is required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input type="text" class="form-control" id="cc-expiration" placeholder="" required />
              <div class="invalid-feedback">
                Expiration date required
              </div>
            </div>
        </div>

        <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="" required />
              <div class="invalid-feedback">
                Security code required
              </div>
            </div>

            <hr class="my-4"/>
            <button class="w-100 btn btn-warning btn-lg" type="submit">Continue to checkout</button>
          </div>

         
    </>
  )
}

export default Checkout