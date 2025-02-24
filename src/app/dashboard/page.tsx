'use client';
import useApiData from '@/helpers/useApiData';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useCallback } from 'react';
import { LogOut, User, Mail, Phone } from 'lucide-react'; // Optional: Add lucide-react for icons

const DashboardPage = () => {
  const router = useRouter();
  const { data: dashboardData, loading, accessToken } = useApiData('/api/dashboard', 'POST');

  const handleLogout = useCallback(async () => {
    try {
      const response = await axios.post('/api/logout', null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response?.status === 200) {
        Cookies.remove('accessToken');
        toast.success('Logout successful. Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error :any) {
      toast.error('An error occurred during logout: ' + (error.message || 'Unknown error'));
    }
  }, [accessToken, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* User Info Card */}
          {dashboardData?.data ? (
            <div className="p-6">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {dashboardData.data.username}
                  </h2>
                  <p className="text-sm text-gray-600">Role: {dashboardData.data.role}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{dashboardData.data.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mobile</p>
                    <p className="text-gray-900">{dashboardData.data.mobileNumber}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created At</p>
                    <p className="text-gray-900">
                      {new Date(dashboardData.data.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Updated</p>
                    <p className="text-gray-900">
                      {new Date(dashboardData.data.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No user data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;