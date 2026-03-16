import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/rti/my-applications/')
      .then(res => {
        setApplications(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RightToKnow</h1>
        <button onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-600 px-4 py-1 rounded">
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My RTI Applications</h2>
          <button onClick={() => navigate('/file-rti')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + File New RTI
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500 text-lg">No RTI applications found</p>
            <button onClick={() => navigate('/file-rti')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              File Your First RTI
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600">App. No</th>
                  <th className="px-4 py-3 text-left text-gray-600">Subject</th>
                  <th className="px-4 py-3 text-left text-gray-600">Department</th>
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
                    <td className="px-4 py-3">{app.created_at}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/track/${app.application_no}`)}
                        className="text-blue-600 hover:underline text-sm">
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}