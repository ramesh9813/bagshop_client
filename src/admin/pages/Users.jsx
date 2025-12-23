import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const Users = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const { user: currentUser } = useSelector(state => state.auth)

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/admin/users`,
                { withCredentials: true }
            )
            if (data.success) {
                setUsers(data.users)
            }
        } catch (error) {
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRoleUpdate = async (userId, currentRole) => {
        // Double check safety
        if (currentUser.role !== 'owner') {
            toast.error("Only Owners can manage user roles")
            return
        }

        const newRole = currentRole === 'user' ? 'admin' : 'user'
        if (window.confirm(`Are you sure you want to change role to ${newRole}?`)) {
            try {
                const { data } = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/admin/user/${userId}`,
                    { role: newRole },
                    { withCredentials: true }
                )
                
                if (data.success) {
                    toast.success(data.message)
                    fetchUsers()
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Update failed")
            }
        }
    }

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
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id.substring(0, 10)}...</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${
                                        user.role === 'admin' ? 'bg-success' : 
                                        user.role === 'owner' ? 'bg-warning text-dark' : 'bg-secondary'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {currentUser.role === 'owner' && user.role !== 'owner' && (
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleRoleUpdate(user._id, user.role)}
                                            title="Change Role"
                                        >
                                            <i className="bi bi-person-gear"></i> Change Role
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}

export default Users