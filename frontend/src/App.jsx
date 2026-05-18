import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';
import BrowsePage from './pages/BrowsePage';
import CompaniesPage from './pages/admin/CompaniesPage';
import CompanyCreate from './pages/admin/CompanyCreate';
import AdminJobs from './pages/admin/AdminJobs';
import PostJobPage from './pages/admin/PostJobPage';
import Applicants from './pages/admin/Applicants';
import MessagesPage from './pages/MessagesPage';
import { Toaster } from 'react-hot-toast';
import LoginPrompt from './components/LoginPrompt';

function App() {
  return (
    <div className="min-h-screen font-sans bg-slate-50 dark:bg-[#121212] text-slate-900 dark:text-white relative selection:bg-blue-500 selection:text-white z-0 transition-colors duration-300">

      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Global Floating Login Prompt for Guest Users */}
      <LoginPrompt />
      
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/description/:id" element={<JobDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          {/* Admin Routes */}
          <Route path="/admin/companies" element={<CompaniesPage />} />
          <Route path="/admin/companies/create" element={<CompanyCreate />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<PostJobPage />} />
          <Route path="/admin/jobs/:id/applicants" element={<Applicants />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
