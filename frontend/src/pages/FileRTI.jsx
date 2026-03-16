import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function FileRTI() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    district: '', department: '', subject: '', description: ''
  });
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/rti/districts/')
      .then(res => setDistricts(res.data))
      .catch(() => setError('Could not load districts. Make sure backend is running.'));

    API.get('/rti/departments/')
      .then(res => setDepartments(res.data))
      .catch(() => { });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('district', formData.district);
      data.append('department', formData.department);
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      if (document) data.append('document', document);

      const res = await API.post('/rti/apply/', data);
      alert(`RTI Filed Successfully! Your Application No: ${res.data.application_no}`);
      navigate('/my-applications');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">RightToKnow - Tamil Nadu RTI Portal</h1>
        <button onClick={() => navigate('/dashboard')}
          className="bg-white text-blue-600 px-4 py-1 rounded">
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            File RTI Application
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* District */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Select District
              </label>
              <select name="district" onChange={handleChange}
                className="w-full border p-2 rounded" required>
                <option value="">-- Select District --</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Select Department
              </label>
              <select name="department" onChange={handleChange}
                className="w-full border p-2 rounded" required>
                <option value="">-- Select Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <input name="subject" placeholder="Enter RTI subject"
                onChange={handleChange}
                className="w-full border p-2 rounded" required />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea name="description" rows="5"
                placeholder="Describe your RTI request in detail..."
                onChange={handleChange}
                className="w-full border p-2 rounded" required />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Supporting Document (Optional)
              </label>
              <input type="file" accept=".pdf,.jpg,.png"
                onChange={(e) => setDocument(e.target.files[0])}
                className="w-full border p-2 rounded" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              {loading ? 'Submitting...' : 'Submit RTI Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}