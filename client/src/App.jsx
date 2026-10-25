import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterWorker from './pages/RegisterWorker';
import RegisterEmployer from './pages/RegisterEmployer';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerJobs from './pages/worker/Jobs';
import WorkerApplications from './pages/worker/Applications';
import WorkerProfile from './pages/worker/Profile';
import WorkerGrievance from './pages/worker/Grievance';

// Employer Pages
import EmployerDashboard from './pages/employer/Dashboard';
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import JobApplicants from './pages/employer/Applicants';
import EmployerProfile from './pages/employer/Profile';
import EmployerGrievance from './pages/employer/Grievance';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import WorkerApprovals from './pages/admin/WorkerApprovals';
import EmployerApprovals from './pages/admin/EmployerApprovals';
import Users from './pages/admin/Users';
import Jobs from './pages/admin/Jobs';
import Complaints from './pages/admin/Complaints';
import Reports from './pages/admin/Reports';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, hasRole, user } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated()) {
    switch (user?.role) {
      case 'worker':
        return <Navigate to="/worker/dashboard" replace />;
      case 'employer':
        return <Navigate to="/employer/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register/worker" element={<PublicRoute><RegisterWorker /></PublicRoute>} />
              <Route path="/register/employer" element={<PublicRoute><RegisterEmployer /></PublicRoute>} />

              <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['worker']}><WorkerDashboard /></ProtectedRoute>} />
              <Route path="/worker/jobs" element={<ProtectedRoute allowedRoles={['worker']}><WorkerJobs /></ProtectedRoute>} />
              <Route path="/worker/applications" element={<ProtectedRoute allowedRoles={['worker']}><WorkerApplications /></ProtectedRoute>} />
              <Route path="/worker/profile" element={<ProtectedRoute allowedRoles={['worker']}><WorkerProfile /></ProtectedRoute>} />
              <Route path="/worker/grievance" element={<ProtectedRoute allowedRoles={['worker']}><WorkerGrievance /></ProtectedRoute>} />

              <Route path="/employer/dashboard" element={<ProtectedRoute allowedRoles={['employer']}><EmployerDashboard /></ProtectedRoute>} />
              <Route path="/employer/post-job" element={<ProtectedRoute allowedRoles={['employer']}><PostJob /></ProtectedRoute>} />
              <Route path="/employer/jobs" element={<ProtectedRoute allowedRoles={['employer']}><ManageJobs /></ProtectedRoute>} />
              <Route path="/employer/jobs/:jobId/applicants" element={<ProtectedRoute allowedRoles={['employer']}><JobApplicants /></ProtectedRoute>} />
              <Route path="/employer/profile" element={<ProtectedRoute allowedRoles={['employer']}><EmployerProfile /></ProtectedRoute>} />
              <Route path="/employer/grievance" element={<ProtectedRoute allowedRoles={['employer']}><EmployerGrievance /></ProtectedRoute>} />

              <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/workers/approvals" element={<ProtectedRoute allowedRoles={['admin']}><WorkerApprovals /></ProtectedRoute>} />
              <Route path="/admin/employers/approvals" element={<ProtectedRoute allowedRoles={['admin']}><EmployerApprovals /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
              <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><Jobs /></ProtectedRoute>} />
              <Route path="/admin/complaints" element={<ProtectedRoute allowedRoles={['admin']}><Complaints /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;