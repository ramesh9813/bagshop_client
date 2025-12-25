import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const AddProduct = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const [imageSource, setImageSource] = useState('file') // Default to local file
    const [selectedFile, setSelectedFile] = useState(null)

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
        imageUrl: Yup.string().when([], {
            is: () => imageSource === 'url',
            then: (schema) => schema.url('Invalid URL').required('Image URL is required'),
            otherwise: (schema) => schema.notRequired()
        }),
        stock: Yup.number().required('Stock is required').integer('Stock must be an integer').min(0, 'Stock cannot be negative')
    })

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            
            // Append all fields to FormData
            Object.keys(values).forEach(key => {
                if (key !== 'imageUrl' || imageSource === 'url') {
                    formData.append(key, values[key]);
                }
            });

            if (imageSource === 'file' && selectedFile) {
                formData.append('image', selectedFile);
            }

            formData.append('createdBy', user?._id);

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            }

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/product/new`,
                formData,
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
                    {({ isSubmitting, setFieldValue }) => (
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
                                <label className="form-label d-block">Product Image</label>
                                <div className="btn-group mb-3" role="group">
                                    <input 
                                        type="radio" className="btn-check" id="sourceFile" name="imageSource" 
                                        checked={imageSource === 'file'} onChange={() => setImageSource('file')} 
                                    />
                                    <label className="btn btn-outline-warning" htmlFor="sourceFile">Upload File</label>

                                    <input 
                                        type="radio" className="btn-check" id="sourceUrl" name="imageSource" 
                                        checked={imageSource === 'url'} onChange={() => setImageSource('url')} 
                                    />
                                    <label className="btn btn-outline-warning" htmlFor="sourceUrl">Image URL</label>
                                </div>

                                {imageSource === 'url' ? (
                                    <>
                                        <Field type="text" className="form-control" id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" />
                                        <ErrorMessage name="imageUrl" component="div" className="text-danger small" />
                                    </>
                                ) : (
                                    <div className="card p-3 bg-light border-dashed">
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                setSelectedFile(e.target.files[0]);
                                                setFieldValue('imageUrl', 'file_selected'); // dummy to pass validation
                                            }} 
                                        />
                                        <div className="small text-muted mt-2">Upload a JPG, PNG or WebP image.</div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-warning" disabled={isSubmitting}>
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