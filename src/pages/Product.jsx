import React, { useState, useEffect } from 'react'
import Card from '../component/Card'
import axios from 'axios'
import Spinner from '../component/Spinner'
import { useLocation } from 'react-router-dom'
import Pagination from '../component/Pagination'

const Product = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation();

    // Filter States
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState(10000);
    const [minRating, setMinRating] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get('keyword');

        let url = `${import.meta.env.VITE_API_BASE_URL}/products`;
        if (keyword) {
            url = `${import.meta.env.VITE_API_BASE_URL}/products/search?keyword=${keyword}`;
        }

        axios.get(url)
            .then(res => {
                setProducts(res.data.products);
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
            })
    }, [location.search])

    // Filter Logic
    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    const getFilteredProducts = () => {
        let tempProducts = [...products];

        // 1. Category Filter
        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter(product => selectedCategories.includes(product.category));
        }

        // 2. Price Filter
        tempProducts = tempProducts.filter(product => product.price <= priceRange);

        // 3. Rating Filter
        if (minRating > 0) {
            tempProducts = tempProducts.filter(product => product.ratings >= minRating);
        }

        // 4. Size Filter
        if (selectedSize) {
            tempProducts = tempProducts.filter(product => product.size === selectedSize);
        }

        // 5. Sorting
        if (sortBy === 'newest') {
            tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'price-low-high') {
            tempProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high-low') {
            tempProducts.sort((a, b) => b.price - a.price);
        }

        return tempProducts;
    };

    const filteredProducts = getFilteredProducts();

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Scroll to top when page changes
    };

    // Get unique sizes from all products for the dropdown
    const availableSizes = [...new Set(products.map(p => p.size))].sort();

    return (
        <>
            <div className="container-fluid mt-3">
                <div className="row" style={{ overflowX: 'hidden' }}>
                    {/* Product Grid Section */}
                    <div 
                        className={showFilter ? "col-md-9" : "col-md-11"} 
                        style={{ transition: 'all 0.5s ease-in-out' }}
                    >
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                <div className={`row row-cols-1 ${showFilter ? 'row-cols-md-3' : 'row-cols-md-4'} g-4`}>
                                    {currentProducts.length > 0 ? (
                                        currentProducts.map((item, i) => (
                                            <Card data={item} key={i} />
                                        ))
                                    ) : (
                                        <div className="alert alert-info w-100 text-center" role="alert">
                                            No products found matching your filters.
                                        </div>
                                    )}
                                </div>
                                
                                {/* Pagination Control */}
                                {filteredProducts.length > itemsPerPage && (
                                    <Pagination 
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Filter Sidebar / Icon Section */}
                    <div 
                        className={showFilter ? "col-md-3 border-start" : "col-md-1 text-end"}
                        style={{ transition: 'all 0.5s ease-in-out' }}
                    >
                        
                        {/* Toggle Icon */}
                        <div className="d-flex justify-content-end mb-3">
                             <button 
                                className="btn btn-light border" 
                                onClick={() => setShowFilter(!showFilter)}
                                title={showFilter ? "Close Filter" : "Open Filter"}
                             >
                                <i className={`bi ${showFilter ? 'bi-x-lg' : 'bi-layout-sidebar'}`} style={{fontSize: '1.5rem'}}></i>
                             </button>
                        </div>

                        {/* Sidebar Content */}
                        {showFilter && (
                            <div 
                                className="filter-content p-2"
                                style={{ 
                                    animation: 'fadeIn 0.7s ease-in-out',
                                    opacity: 1
                                }}
                            >
                                <style>
                                    {`
                                        @keyframes fadeIn {
                                            0% { opacity: 0; transform: translateX(20px); }
                                            100% { opacity: 1; transform: translateX(0); }
                                        }
                                    `}
                                </style>
                                <h4 className="fw-bold mb-3">Filters</h4>

                                {/* Sort By */}
                                <div className="mb-4">
                                    <h6 className="fw-bold">Sort By</h6>
                                    <select 
                                        className="form-select" 
                                        value={sortBy} 
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="newest">New Arrivals</option>
                                        <option value="price-low-high">Price: Low to High</option>
                                        <option value="price-high-low">Price: High to Low</option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div className="mb-4">
                                    <h6 className="fw-bold">Category</h6>
                                    {['Men', 'Women', 'Children'].map(cat => (
                                        <div className="form-check" key={cat}>
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                value={cat} 
                                                id={`cat-${cat}`}
                                                checked={selectedCategories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                            />
                                            <label className="form-check-label" htmlFor={`cat-${cat}`}>
                                                {cat}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Sizes */}
                                <div className="mb-4">
                                    <h6 className="fw-bold">Size</h6>
                                    <select 
                                        className="form-select" 
                                        value={selectedSize} 
                                        onChange={(e) => {
                                            setSelectedSize(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value="">All Sizes</option>
                                        {availableSizes.map(size => (
                                            <option key={size} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-4">
                                    <h6 className="fw-bold">Max Price: NRS {priceRange}</h6>
                                    <input 
                                        type="range" 
                                        className="form-range" 
                                        min="0" 
                                        max="10000" 
                                        step="100" 
                                        value={priceRange} 
                                        onChange={(e) => {
                                            setPriceRange(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>

                                {/* Ratings */}
                                <div className="mb-4">
                                    <h6 className="fw-bold">Minimum Rating</h6>
                                    {[4, 3, 2, 1].map(star => (
                                        <div className="form-check" key={star}>
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="rating" 
                                                id={`rating-${star}`}
                                                checked={minRating === star}
                                                onChange={() => {
                                                    setMinRating(star);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`rating-${star}`}>
                                                {star} <i className="bi bi-star-fill text-warning"></i> & Up
                                            </label>
                                        </div>
                                    ))}
                                     <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="rating" 
                                                id="rating-0"
                                                checked={minRating === 0}
                                                onChange={() => {
                                                    setMinRating(0);
                                                    setCurrentPage(1);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="rating-0">
                                                Any Rating
                                            </label>
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button 
                                    className="btn btn-outline-danger w-100"
                                    onClick={() => {
                                        setSortBy('newest');
                                        setSelectedCategories([]);
                                        setPriceRange(10000);
                                        setMinRating(0);
                                        setSelectedSize('');
                                        setCurrentPage(1);
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product