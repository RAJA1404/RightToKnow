import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '',
    password: '', phone: '', address: '', aadhaar_no: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/register/', formData);
      alert('Account created successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          RightToKnow - Register
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="first_name" placeholder="First Name" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="last_name" placeholder="Last Name" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="address" placeholder="Address" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <input name="aadhaar_no" placeholder="Aadhaar Number (12 digits)" onChange={handleChange}
            className="w-full border p-2 rounded" required />
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}