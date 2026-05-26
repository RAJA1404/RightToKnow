import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import NewRTIRequest from './pages/NewRTIRequest';
import ReviewDraft from './pages/ReviewDraft';
import FAQ from './pages/FAQ';
import Guidelines from './pages/Guidelines';
import TrackApplication from './pages/TrackApplication';
import Home from './pages/Home';
import PublicAuthority from './pages/PublicAuthority';
import SubmittedRequest from './pages/SubmittedRequest';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/smart-assistant" element={<NewRTIRequest />} />
            <Route path="/review-draft" element={<ReviewDraft />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/public-authority" element={<PublicAuthority />} />
            <Route path="/track-smart-rti" element={<TrackApplication />} />
            <Route path="/submitted-request" element={<SubmittedRequest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
