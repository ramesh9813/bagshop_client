import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useSortableData } from '../../hooks/useSortableData'

const InquiryList = () => {
    const [inquiries, setInquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { items: sortedInquiries, requestSort, sortConfig } = useSortableData(inquiries);

    const fetchInquiries = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/inquiries`,
                { withCredentials: true }
            )
            if (data.success) {
                setInquiries(data.inquiries)
            }
        } catch (error) {
            toast.error("Failed to fetch inquiries")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInquiries()
    }, [])

    const SortIcon = ({ name }) => {
        if (sortConfig?.key === name) {
            return sortConfig.direction === 'ascending' ? <i className="bi bi-caret-up-fill ms-1"></i> : <i className="bi bi-caret-down-fill ms-1"></i>;
        }
        return <i className="bi bi-caret-up ms-1 text-muted opacity-25"></i>;
    };

  return (
    <div>
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
                            <th scope="col" onClick={() => requestSort('createdAt')} style={{cursor: 'pointer'}}>Date <SortIcon name="createdAt"/></th>
                            <th scope="col" onClick={() => requestSort('name')} style={{cursor: 'pointer'}}>Name <SortIcon name="name"/></th>
                            <th scope="col" onClick={() => requestSort('email')} style={{cursor: 'pointer'}}>Email <SortIcon name="email"/></th>
                            <th scope="col" onClick={() => requestSort('product')} style={{cursor: 'pointer'}}>Product <SortIcon name="product"/></th>
                            <th scope="col" onClick={() => requestSort('subject')} style={{cursor: 'pointer'}}>Subject <SortIcon name="subject"/></th>
                            <th scope="col">Message (Preview)</th>
                            <th scope="col" onClick={() => requestSort('status')} style={{cursor: 'pointer'}}>Status <SortIcon name="status"/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedInquiries && sortedInquiries.map(inquiry => (
                            <tr 
                                key={inquiry._id} 
                                onClick={() => navigate(`/admin/inquiry/${inquiry._id}`)}
                                style={{cursor: 'pointer'}}
                                title="Click to view full details"
                            >
                                <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                <td>{inquiry.name}</td>
                                <td>{inquiry.email}</td>
                                <td>{inquiry.product || '-'}</td>
                                <td>{inquiry.subject}</td>
                                <td>
                                    {inquiry.message.length > 50 
                                        ? inquiry.message.substring(0, 50) + '...' 
                                        : inquiry.message}
                                </td>
                                <td>
                                    <span className={`badge ${
                                        inquiry.status === 'New' ? 'bg-secondary' : 
                                        inquiry.status === 'Resolved' ? 'bg-success' : 'bg-warning text-dark'
                                    }`}>
                                        {inquiry.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {inquiries.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No inquiries found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}

export default InquiryList
