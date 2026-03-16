import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function TrackStatus() {
  const { application_no } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/rti/track/${application_no}/`)
      .then(res => {
        setApplication(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Application not found');
        setLoading(false);
      });
  }, [application_no]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-500';
      case 'RECEIVED': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-orange-500';
      case 'RESPONDED': return 'bg-green-500';
      case 'CLOSED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const allStatuses = ['SUBMITTED', 'RECEIVED', 'IN_PROGRESS', 'RESPONDED', 'CLOSED'];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RightToKnow</h1>
        <button onClick={() => navigate('/my-applications')}
          className="bg-white text-blue-600 px-4 py-1 rounded">
          Back to Applications
        </button>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/* Application Details */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                Track RTI Application
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Application No</p>
                  <p className="font-bold font-mono">{application.application_no}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Department</p>
                  <p className="font-bold">{application.district}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Subject</p>
                  <p className="font-bold">{application.subject}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Filed On</p>
                  <p className="font-bold">{application.created_at}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Current Status</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Status Timeline</h3>
              <div className="flex justify-between items-center">
                {allStatuses.map((status, index) => {
                  const isCompleted = allStatuses.indexOf(application.status) >= index;
                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCompleted ? getStatusColor(status) : 'bg-gray-300'}`}>
                        {index + 1}
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">
                        {status.replace('_', ' ')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Update History */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Update History</h3>
              {application.updates.length === 0 ? (
                <p className="text-gray-500">No updates yet</p>
              ) : (
                <div className="space-y-3">
                  {application.updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between">
                        <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(update.status)}`}>
                          {update.status}
                        </span>
                        <span className="text-gray-400 text-sm">{update.updated_at}</span>
                      </div>
                      {update.remarks && (
                        <p className="text-gray-600 mt-1 text-sm">{update.remarks}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}