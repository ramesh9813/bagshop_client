import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const AddProduct = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)

    const initialValues = {
        name: '',
        description: '',
        price: '',
        category: '',
        size: '',
        imageUrl: '',
        stock: ''
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        category: Yup.string().required('Category is required'),
        size: Yup.string().required('Size is required'),
        imageUrl: Yup.string().url('Invalid URL').required('Image URL is required'),
        stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative')
    })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }

            const productData = {
                ...values,
                createdBy: user?._id // Send current user ID
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/product/new`,
                productData,
                config
            )

            if (data.success) {
                toast.success("Product Created Successfully")
                resetForm()
                navigate('/admin/products')
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create product")
        } finally {
            setSubmitting(false)
        }
    }

  return (
    <div>
        <div className="row">
            <div className="col-md-8">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
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
                                <Field type="text" className="form-control" id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" />
                                <ErrorMessage name="imageUrl" component="div" className="text-danger small" />
                            </div>

                            <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Add Product'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </div>
  )
}

export default AddProduct