import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const { backendUrl, getToken } = useContext(AppContext);
    const [pendingUsers, setPendingUsers] = useState([]);

    const fetchRequests = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(`${backendUrl}/api/educator/requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setPendingUsers(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleAction = async (userId, action) => {
        try {
            const token = await getToken();
            const { data } = await axios.post(
                `${backendUrl}/api/educator/approve/${userId}`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                fetchRequests(); // refresh list
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="min-h-screen p-8 md:px-36 text-left">
            <h1 className="text-2xl font-semibold mb-6">Educator Role Requests</h1>

            {pendingUsers.length === 0 ? (
                <p className="text-gray-500">No pending requests.</p>
            ) : (
                <div className="overflow-auto border rounded-md">
                    <table className="w-full table-auto text-sm text-gray-700">
                        <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingUsers.map((user) => (
                            <tr key={user._id} className="border-b">
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2 space-x-2">
                                    <button
                                        onClick={() => handleAction(user._id, 'approve')}
                                        className="px-3 py-1 bg-green-600 text-white rounded"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(user._id, 'reject')}
                                        className="px-3 py-1 bg-red-600 text-white rounded"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
