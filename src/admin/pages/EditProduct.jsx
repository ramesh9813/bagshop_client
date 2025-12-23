import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'

const EditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/${id}`)
                if (data.success) {
                    setProduct(data.product)
                }
            } catch (error) {
                toast.error("Failed to load product details")
            } finally {
                setLoading(false)
            }
        }
        fetchProductDetails()
    }, [id])

    const validationSchema = Yup.object({
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        category: Yup.string().required('Category is required'),
        size: Yup.string().required('Size is required'),
        imageUrl: Yup.string().url('Invalid URL').required('Image URL is required'),
        stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative')
    })

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }

            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/product/${id}`,
                values,
                config
            )

            if (data.success) {
                toast.success("Product Updated Successfully")
                navigate('/admin/products')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>

    if (!product) return <div className="text-center py-5">Product not found</div>

    return (
        <div>
            <div className="row">
                <div className="col-md-8">
                    <Formik
                        initialValues={{
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            size: product.size,
                            imageUrl: product.imageUrl,
                            stock: product.stock
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Product Name</label>
                                    <Field type="text" className="form-control" id="name" name="name" />
                                    <ErrorMessage name="name" component="div" className="text-danger small" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <Field as="textarea" className="form-control" id="description" name="description" rows="3" />
                                    <ErrorMessage name="description" component="div" className="text-danger small" />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="price" className="form-label">Price</label>
                                        <Field type="number" className="form-control" id="price" name="price" />
                                        <ErrorMessage name="price" component="div" className="text-danger small" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="stock" className="form-label">Stock</label>
                                        <Field type="number" className="form-control" id="stock" name="stock" />
                                        <ErrorMessage name="stock" component="div" className="text-danger small" />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <Field as="select" className="form-select" id="category" name="category">
                                            <option value="">Select Category</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Children">Children</option>
                                        </Field>
                                        <ErrorMessage name="category" component="div" className="text-danger small" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="size" className="form-label">Size</label>
                                        <Field type="text" className="form-control" id="size" name="size" placeholder="e.g. M, L, XL or 42" />
                                        <ErrorMessage name="size" component="div" className="text-danger small" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="imageUrl" className="form-label">Image URL</label>
                                    <Field type="text" className="form-control" id="imageUrl" name="imageUrl" />
                                    <ErrorMessage name="imageUrl" component="div" className="text-danger small" />
                                </div>

                                <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update Product'}
                                </button>
                                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/products')}>Cancel</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default EditProduct