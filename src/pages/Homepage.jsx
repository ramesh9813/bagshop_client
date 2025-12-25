import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Carousel from '../component/Carousel'
import Card from '../component/Card'
import Spinner from '../component/Spinner'

const Homepage = () => {
  const [products, setProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([]) // New state for Trending
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch products for the "Latest Arrivals" section
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
      .then(res => {
        // Just take the first 4 products for the New Arrivals
        setProducts(res.data.products.slice(0, 4));
        
        // Take the next 4 products for Weekly Trending (mock logic)
        // Ensure there are enough products, otherwise fallback to empty array
        if (res.data.products.length >= 8) {
             setTrendingProducts(res.data.products.slice(4, 8));
        } else if (res.data.products.length > 4) {
             setTrendingProducts(res.data.products.slice(4, res.data.products.length));
        }
        
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
  }, [])

  return (
    <main>
       

      <div className="container">
        {/* Marketing / Welcome Section */}
        <section className="row align-items-center mb-5 py-4">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold lh-1 mb-3">Carry Your World <span className="text-warning">With Style.</span></h1>
            <p className="lead text-muted">
              From rugged hiking packs for men and chic handbags for women to durable school bags for kids—we have the perfect companion for every journey and every member of the family.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Link to="/products" className="btn btn-warning btn-lg px-4 me-md-2 text-white fw-bold">Explore Collection</Link>
              <Link to="/about" className="btn btn-outline-secondary btn-lg px-4">Our Story</Link>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block text-center">
             <i className="bi bi-bag-heart-fill text-warning" style={{ fontSize: '12rem' }}></i>
          </div>
        </section>

        {/* Featured / Latest Products Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">New Arrivals</h2>
            <Link to="/products" className="text-decoration-none text-warning fw-bold">View All <i className="bi bi-arrow-right"></i></Link>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner />
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {products.length > 0 ? (
                products.map((item, i) => (
                  <Card data={item} key={i} />
                ))
              ) : (
                <div className="col-12 text-center py-5 text-muted">
                  No products found.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Weekly Trending Section */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold">Weekly Trending Bags</h2>
            <Link to="/products" className="text-decoration-none text-warning fw-bold">View All <i className="bi bi-arrow-right"></i></Link>
          </div>
          
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner />
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {trendingProducts.length > 0 ? (
                trendingProducts.map((item, i) => (
                  <Card data={item} key={i} />
                ))
              ) : (
                <div className="col-12 text-center py-5 text-muted">
                  No trending products available this week.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Categories / Highlights Section */}
        <section className="mb-5">
           <h2 className="fw-bold mb-4 text-center">Bags for Everyone</h2>
           <div className="row g-3">
              <div className="col-md-4">
                <div className="p-5 text-bg-dark rounded-3 text-center h-100 d-flex flex-column justify-content-center">
                  <i className="bi bi-person-standing fs-1 mb-3 text-warning"></i>
                  <h3>For Him</h3>
                  <p>Rugged backpacks for hiking, travel, and college commutes.</p>
                </div>
              </div>
              <div className="col-md-4">
                 <div className="p-5 bg-warning rounded-3 text-center h-100 d-flex flex-column justify-content-center text-white">
                  <i className="bi bi-person-standing-dress fs-1 mb-3 text-black"></i>
                  <h3 className="text-black">For Her</h3>
                  <p className="text-black">Elegant bags for daily use, parties, and romantic dates.</p>
                </div>
              </div>
              <div className="col-md-4">
                 <div className="p-5 text-bg-secondary rounded-3 text-center h-100 d-flex flex-column justify-content-center">
                  <i className="bi bi-emoji-smile fs-1 mb-3 text-warning"></i>
                  <h3>For Kids</h3>
                  <p>Fun, durable, and spacious school bags for the little ones.</p>
                </div>
              </div>
           </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-5 mb-0 bg-light rounded-3">
           <div className="row justify-content-center text-center">
             <div className="col-lg-12">
               <h2 className="fw-bold mb-3">Stay in the Loop</h2>
               <p className="lead mb-4">Subscribe for the latest trends in fashion, travel tips, and back-to-school offers.</p>
               <div className="input-group mb-3 w-75 mx-auto">
                 <input type="text" className="form-control" placeholder="Enter your email" aria-label="Recipient's email"/>
                 <button className="btn btn-outline-warning" type="button">Subscribe</button>
               </div>
             </div>
           </div>
        </section>

      </div>
    </main>
  )
}

export default Homepage