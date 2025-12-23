import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Spinner from '../../component/Spinner'

const ActivityLogs = () => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/logs`,
                    { withCredentials: true }
                )
                if (data.success) {
                    setLogs(data.logs)
                }
            } catch (error) {
                console.error("Error fetching logs", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    const getActionBadge = (action) => {
        const colors = {
            'CREATE': 'bg-success',
            'UPDATE': 'bg-secondary',
            'DELETE': 'bg-danger',
            'CHANGE_ROLE': 'bg-warning text-dark',
            'UPDATE_STATUS': 'bg-info text-dark'
        }
        return `badge ${colors[action] || 'bg-secondary'}`
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0">Admin Activity Monitor</h3>
                <span className="text-muted small">Tracking the last 100 sensitive actions</span>
            </div>

            {loading ? <Spinner /> : (
                <div className="card shadow-sm border-0">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Timestamp</th>
                                        <th>Admin / User</th>
                                        <th>Action</th>
                                        <th>Target</th>
                                        <th className="pe-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log, i) => (
                                        <tr key={i}>
                                            <td className="ps-4 text-muted small">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle p-2 me-2">
                                                        <i className="bi bi-person-fill"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold small">{log.user?.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{log.user?.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={getActionBadge(log.action)}>{log.action}</span>
                                            </td>
                                            <td>
                                                <span className="fw-bold small">{log.targetType}</span>
                                                <div className="text-muted" style={{ fontSize: '0.7rem' }}>ID: {log.targetId?.substring(0, 8)}...</div>
                                            </td>
                                            <td className="pe-4 small italic">
                                                "{log.details}"
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">No activities recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ActivityLogs
