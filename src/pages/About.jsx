import React from 'react'

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="text-center mb-4">About BagShop</h1>
          <p className="lead text-center mb-5">
            Your one-stop destination for stylish, functional, and durable bags for the whole family.
          </p>
          
          <div className="mb-5">
            <h3>Who We Are</h3>
            <p>
              At BagShop, we understand that a bag is more than just a container—it's a lifestyle statement. We cater to everyone: 
              men looking for rugged companions for their hiking adventures or college commutes, women seeking the perfect accessory for a party 
              or daily wear, and parents finding durable, fun school bags for their children.
            </p>
          </div>

          <div className="mb-5">
            <h3>Our Mission</h3>
            <p>
              Our mission is to simplify your life by offering a curated selection of high-quality bags for every occasion. 
              Whether you are scaling a mountain, heading to a romantic date, or sending your little one off to their first day of school, 
              we have the perfect bag to match the moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About