'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import DashboardStats from '../../../components/DashboardStats';
import RecentOrders from '../../../components/RecentOrders';
import QuickActions from '../../../components/QuickActions';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token');
        }

        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username || 'Admin'}!
            </h1>
            <p className="text-gray-600">
              Role: <span className="font-semibold text-blue-600">{user?.role || 'Unknown'}</span>
            </p>
            <p className="text-sm text-gray-500">
              Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
            </p>
          </div>

          {/* Dashboard Stats */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <DashboardStats data={dashboardData} />
          )}

          {/* Quick Actions */}
          <QuickActions userRole={user?.role} hasPermission={hasPermission} />

          {/* Recent Orders - Only show if user has permission */}
          {hasPermission('manage_orders') && (
            <RecentOrders />
          )}

          {/* Role-based Content */}
          {user?.role === 'SUPER_ADMIN' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-blue-800 font-semibold mb-2">Super Admin Panel</h3>
              <p className="text-blue-600 mb-4">
                You have full access to all administrative functions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Manage Admins
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  System Settings
                </button>
              </div>
            </div>
          )}

          {user?.role === 'ADMIN' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-green-800 font-semibold mb-2">Admin Panel</h3>
              <p className="text-green-600 mb-4">
                You have access to product and order management.
              </p>
              <div className="text-sm text-gray-600">
                <p>Your permissions:</p>
                <ul className="list-disc ml-4 mt-2">
                  {user?.permissions?.map(permission => (
                    <li key={permission}>{permission.replace('_', ' ').toUpperCase()}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
