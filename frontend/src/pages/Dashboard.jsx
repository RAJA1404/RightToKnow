import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, responded: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    API.get('/rti/dashboard-stats/')
      .then(res => setStats(res.data))
      .catch(() => { });

    API.get('/rti/notifications/')
      .then(res => setNotifications(res.data))
      .catch(() => { });
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    await API.post('/rti/notifications/read/');
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RightToKnow</h1>
        <div className="flex gap-4 items-center">
          {/* Notifications Bell */}
          <div className="relative">
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-1">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                <div className="flex justify-between items-center p-3 border-b">
                  <span className="font-bold text-gray-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-blue-600 text-xs hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-sm p-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3 border-b text-sm ${n.is_read ? 'text-gray-400' : 'text-gray-800 bg-blue-50'}`}>
                        <p>{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <span>Welcome, {user?.first_name}!</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Citizen Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total RTIs</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">Pending</h3>
            <p className="text-4xl font-bold text-yellow-500 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-600">Responded</h3>
            <p className="text-4xl font-bold text-green-500 mt-2">{stats.responded}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <button onClick={() => navigate('/file-rti')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              File New RTI
            </button>
            <button onClick={() => navigate('/my-applications')}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
              My Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}