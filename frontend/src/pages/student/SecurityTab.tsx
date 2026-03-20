import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const SecurityTab: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (passwords.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/api/auth/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      
      setSuccess(response.data.message || 'Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8  w-full mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Security</h3>
        <p className="text-sm text-gray-500">
          Manage your account security settings and authentication methods
        </p>
      </div>

      {/* Status Messages */}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

      {/* Change Password Card */}
      <div className="border border-gray-100 rounded-xl bg-gray-50/30 p-6 md:p-8">
        
        {/* Section Title with Icon */}
        <div className="flex items-center gap-2 mb-6 text-[#3b82f6]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h4 className="text-base font-semibold text-gray-900">Change Password</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-800 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm (Grid layout on medium screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-800 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm text-gray-800 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 leading-relaxed mt-2">
            Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters
          </p>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SecurityTab;