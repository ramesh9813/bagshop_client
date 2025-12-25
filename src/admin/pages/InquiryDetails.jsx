import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const InquiryDetails = () => {
    const { id } = useParams()
    const [inquiry, setInquiry] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchInquiryDetails = async () => {
            try {
                // Since we don't have a specific single inquiry endpoint yet, 
                // we will fetch all and filter (or we should create one).
                // Ideally: GET /admin/inquiry/:id
                // For now, let's reuse the admin logic or create the endpoint.
                // Assuming we will create the endpoint in the backend in the next step.
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/inquiry/${id}`,
                    { withCredentials: true }
                )
                if (data.success) {
                    setInquiry(data.inquiry)
                }
            } catch (error) {
                toast.error("Failed to fetch inquiry details")
            } finally {
                setLoading(false)
            }
        }
        fetchInquiryDetails()
    }, [id])

    const updateStatus = async (newStatus) => {
        try {
            const { data } = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/admin/inquiry/${id}`,
                { status: newStatus },
                { withCredentials: true }
            )
            if (data.success) {
                toast.success("Status updated successfully")
                setInquiry({ ...inquiry, status: newStatus })
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    if (!inquiry) return <div className="text-center py-5">Inquiry not found</div>

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4">
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Inquiry Details</h6>
                    <Link to="/admin/inquiries" className="btn btn-sm btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i> Back to List
                    </Link>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5 className="mb-3 text-secondary">Sender Information</h5>
                            <p><strong>Name:</strong> {inquiry.name}</p>
                            <p><strong>Email:</strong> <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></p>
                            <p><strong>Date:</strong> {new Date(inquiry.createdAt).toLocaleString()}</p>
                            <p><strong>Status:</strong> 
                                <span className={`badge ms-2 ${
                                    inquiry.status === 'New' ? 'bg-secondary' : 
                                    inquiry.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'
                                }`}>
                                    {inquiry.status}
                                </span>
                            </p>
                            <div className="mt-3">
                                <label className="form-label fw-bold">Update Status:</label>
                                <select 
                                    className="form-select w-auto d-inline-block ms-2"
                                    value={inquiry.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                             <h5 className="mb-3 text-secondary">Inquiry Context</h5>
                             <p><strong>Product Interest:</strong> {inquiry.product || 'General Inquiry'}</p>
                             <p><strong>Subject:</strong> {inquiry.subject}</p>
                        </div>
                    </div>

                    <hr />

                    <div className="row mt-4">
                        <div className="col-12">
                            <h5 className="mb-3 text-secondary">Message Content</h5>
                            <div className="p-4 bg-light rounded border">
                                <p style={{whiteSpace: 'pre-wrap'}}>{inquiry.message}</p>
                            </div>
                        </div>
                    </div>

                    {inquiry.image && inquiry.image.url && (
                        <div className="row mt-4">
                            <div className="col-12">
                                <h5 className="mb-3 text-secondary">Attachment</h5>
                                <div className="card" style={{width: 'fit-content'}}>
                                    <a href={inquiry.image.url} target="_blank" rel="noopener noreferrer">
                                        <img 
                                            src={inquiry.image.url} 
                                            alt="Inquiry Attachment" 
                                            className="card-img-top img-fluid"
                                            style={{maxHeight: '400px', objectFit: 'contain'}}
                                        />
                                    </a>
                                    <div className="card-footer text-center text-muted small">
                                        Click to view full size
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InquiryDetails
