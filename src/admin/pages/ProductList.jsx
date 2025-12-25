import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSortableData } from '../../hooks/useSortableData'

const ProductList = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { items: sortedProducts, requestSort, sortConfig } = useSortableData(products);

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
            if (data.success) {
                setProducts(data.products)
            }
        } catch (error) {
            toast.error("Failed to fetch products")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const { data } = await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/product/${id}`,
                    { withCredentials: true }
                )
                if (data.success) {
                    toast.success("Product deleted successfully")
                    fetchProducts() // Refresh list
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed")
            }
        }
    }

    const updateStock = async (id, currentStock, change) => {
        const newStock = currentStock + change;
        if (newStock < 0) return; // Prevent negative stock

        try {
            // Optimistic Update
            const updatedProducts = products.map(p => 
                p._id === id ? { ...p, stock: newStock } : p
            );
            setProducts(updatedProducts);

            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/product/${id}`,
                { stock: newStock },
                { withCredentials: true }
            );

            if (data.success) {
                 toast.success("Stock updated");
            }
        } catch (error) {
            toast.error("Failed to update stock");
            // Revert on error
            fetchProducts(); 
        }
    }

    const truncateText = (text, charLimit) => {
        if (!text) return ''
        if (text.length > charLimit) {
            return text.substring(0, charLimit) + '...'
        }
        return text
    }

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const SortIcon = ({ name }) => {
        if (sortConfig?.key === name) {
            return sortConfig.direction === 'ascending' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>;
        }
        return <i className="bi bi-caret-up ms-1 text-muted opacity-25"></i>; // Default/Inactive icon
    };

  return (
    <div>
        <div className="d-flex justify-content-end flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
            <div className="btn-toolbar mb-2 mb-md-0">
                <Link to="/admin/product/add" className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-plus-lg me-1"></i>
                    Add New Product
                </Link>
            </div>
        </div>
        
        {loading ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : (
            <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                    <tr>
                    <th scope="col" onClick={() => requestSort('_id')} style={{cursor: 'pointer'}}>ID <SortIcon name="_id"/></th>
                    <th scope="col" onClick={() => requestSort('name')} style={{cursor: 'pointer'}}>Name <SortIcon name="name"/></th>
                    <th scope="col">Description</th>
                    <th scope="col" onClick={() => requestSort('stock')} style={{cursor: 'pointer'}}>Stock <SortIcon name="stock"/></th>
                    <th scope="col" onClick={() => requestSort('price')} style={{cursor: 'pointer'}}>Price <SortIcon name="price"/></th>
                    <th scope="col" onClick={() => requestSort('ratings')} style={{cursor: 'pointer'}}>Rating <SortIcon name="ratings"/></th>
                    <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts && sortedProducts.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id.substring(0, 10)}...</td>
                            <td className="fw-bold">{product.name}</td>
                            <td>{truncateText(product.description, 35)}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <button 
                                        className="btn btn-sm btn-outline-danger me-2"
                                        onClick={() => updateStock(product._id, product.stock, -1)}
                                        disabled={product.stock <= 0}
                                    >
                                        <i className="bi bi-dash"></i>
                                    </button>
                                    <span className="fw-bold" style={{minWidth: '30px', textAlign: 'center'}}>{product.stock}</span>
                                    <button 
                                        className="btn btn-sm btn-outline-success ms-2"
                                        onClick={() => updateStock(product._id, product.stock, 1)}
                                    >
                                        <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                            </td>
                            <td>NRS {product.price}</td>
                            <td>
                                <span className="badge bg-warning text-dark">
                                    {product.ratings} <i className="bi bi-star-fill"></i>
                                </span>
                            </td>
                            <td>
                                <div className="btn-group">
                                    <Link to={`/productdetails/${product._id}`} className="btn btn-sm btn-outline-secondary" title="View">
                                        <i className="bi bi-eye"></i>
                                    </Link>
                                    <Link to={`/admin/product/edit/${product._id}`} className="btn btn-sm btn-outline-primary" title="Edit">
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        title="Delete"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No products found</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        )}
    </div>
  )
}

export default ProductList