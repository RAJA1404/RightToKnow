import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', remarks: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/rti/dept-applications/')
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (id) => {
    try {
      await API.put(`/rti/update-status/${id}/`, statusForm);
      setMessage('Status updated successfully!');
      setSelectedApp(null);
      const res = await API.get('/rti/dept-applications/');
      setApplications(res.data);
    } catch (err) {
      setMessage('Error updating status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'RECEIVED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-700';
      case 'RESPONDED': return 'bg-green-100 text-green-700';
      case 'CLOSED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RightToKnow - District Admin Panel</h1>
        <button onClick={handleLogout}
          className="bg-white text-green-600 px-4 py-1 rounded">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          RTI Applications
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600">App. No</th>
                  <th className="px-4 py-3 text-left text-gray-600">Subject</th>
                  <th className="px-4 py-3 text-left text-gray-600">District</th>
                  <th className="px-4 py-3 text-left text-gray-600">Citizen</th>
                  <th className="px-4 py-3 text-left text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{app.application_no}</td>
                    <td className="px-4 py-3">{app.subject}</td>
                    <td className="px-4 py-3">{app.district}</td>
                    <td className="px-4 py-3">{app.citizen}</td>
                    <td className="px-4 py-3">{app.created_at}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedApp(app)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Update Status Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Update — {selectedApp.application_no}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">New Status</label>
                  <select onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full border p-2 rounded">
                    <option value="">-- Select Status --</option>
                    <option value="RECEIVED">RECEIVED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESPONDED">RESPONDED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Remarks</label>
                  <textarea rows="3" placeholder="Add remarks..."
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    className="w-full border p-2 rounded" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleUpdateStatus(selectedApp.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Update Status
                  </button>
                  <button onClick={() => setSelectedApp(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}