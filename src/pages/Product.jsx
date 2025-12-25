import React, { useState, useEffect, useRef } from 'react'
import Card from '../component/Card'
import axios from 'axios'
import Spinner from '../component/Spinner'
import { useLocation } from 'react-router-dom'
import Pagination from '../component/Pagination'
import { toast } from 'react-toastify';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const Product = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation();

    // Filter States
    const [showFilter, setShowFilter] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [minPossiblePrice, setMinPossiblePrice] = useState(0);
    const [maxPossiblePrice, setMaxPossiblePrice] = useState(10000);
    const [minRating, setMinRating] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Keyboard Input Buffer
    const inputBufferRef = useRef('');
    const inputTimeoutRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
                return;
            }

            // Handle 'f' for filter toggle
            if (e.key.toLowerCase() === 'f') {
                setShowFilter(prev => !prev);
                return;
            }

            // Handle 'c' contextually
            if (e.key.toLowerCase() === 'c') {
                if (showFilter) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // Block global 'c' (Cart)

                    const isDefaultFilter = 
                        sortBy === 'newest' && 
                        selectedCategories.length === 0 && 
                        priceRange[0] === minPossiblePrice &&
                        priceRange[1] === maxPossiblePrice && 
                        minRating === 0 && 
                        selectedSize === '';

                    if (!isDefaultFilter) {
                        setSortBy('newest');
                        setSelectedCategories([]);
                        setPriceRange([minPossiblePrice, maxPossiblePrice]);
                        setMinRating(0);
                        setSelectedSize('');
                        setCurrentPage(1);
                        toast.info("Filters cleared");
                    }
                    return;
                }
                // If showFilter is false, allow propagation -> triggers Cart
            }

            // Handle numeric input for price filter
            if (/^\d$/.test(e.key)) {
                // Clear existing timeout
                if (inputTimeoutRef.current) {
                    clearTimeout(inputTimeoutRef.current);
                }

                inputBufferRef.current += e.key;

                // Set a timeout to commit the buffer
                inputTimeoutRef.current = setTimeout(() => {
                    const newPrice = parseInt(inputBufferRef.current, 10);
                    if (!isNaN(newPrice)) {
                        setPriceRange([minPossiblePrice, Math.min(newPrice, maxPossiblePrice)]); // Sets max price via keyboard
                        setShowFilter(true);
                        toast.info(`Max price set to NRS ${Math.min(newPrice, maxPossiblePrice)}`);
                        setCurrentPage(1);
                    }
                    inputBufferRef.current = ''; // Reset buffer
                }, 1000); // 1 second delay to finish typing
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
        };
    }, [sortBy, selectedCategories, priceRange, minRating, selectedSize, showFilter, minPossiblePrice, maxPossiblePrice]);

    useEffect(() => {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const keyword = searchParams.get('keyword');
        const maxPrice = searchParams.get('maxPrice');

        let url = `${import.meta.env.VITE_API_BASE_URL}/products`;
        if (keyword) {
            url = `${import.meta.env.VITE_API_BASE_URL}/products/search?keyword=${keyword}`;
        }

        axios.get(url)
            .then(res => {
                const fetchedProducts = res.data.products;
                setProducts(fetchedProducts);
                
                if (fetchedProducts.length > 0) {
                    const prices = fetchedProducts.map(p => p.price);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    setMinPossiblePrice(min);
                    setMaxPossiblePrice(max);
                    
                    // Update current range if not explicitly set by URL or previous interaction
                    // Or simply default to full range on new results
                    if (maxPrice) {
                        setPriceRange([min, Number(maxPrice)]);
                        setShowFilter(true);
                    } else {
                        setPriceRange([min, max]);
                    }
                }
                
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

        // 2. Price Filter (Range)
        tempProducts = tempProducts.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

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
        } else if (sortBy === 'best-selling') {
            tempProducts.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
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
                                        <div className="alert alert-info w-100 text-center   " role="alert">
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
                                        <option value="best-selling">Most Sold (Weekly)</option>
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
                                    <h6 className="fw-bold">Price: NRS {priceRange[0]} - NRS {priceRange[1]}</h6>
                                    <div className="px-2 mt-3">
                                        <Slider
                                            range
                                            min={minPossiblePrice}
                                            max={maxPossiblePrice}
                                            step={10}
                                            value={priceRange}
                                            onChange={(val) => {
                                                setPriceRange(val);
                                                setCurrentPage(1);
                                            }}
                                            allowCross={false}
                                            trackStyle={[{ backgroundColor: '#ffc107' }]}
                                            handleStyle={[
                                                { borderColor: '#ffc107', backgroundColor: '#fff', opacity: 1, boxShadow: 'none' },
                                                { borderColor: '#ffc107', backgroundColor: '#fff', opacity: 1, boxShadow: 'none' }
                                            ]}
                                            railStyle={{ backgroundColor: '#e9ecef' }}
                                        />
                                    </div>
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
                                        setPriceRange([minPossiblePrice, maxPossiblePrice]);
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