'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import AdminLayout from '../../../components/AdminLayout';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ADMIN',
    permissions: [],
    isActive: true
  });

  const availablePermissions = [
    'manage_products',
    'manage_orders',
    'manage_users',
    'view_analytics',
    'manage_smtp'
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token');
      }
      }

      const response = await fetch('/api/admin/manage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      setAdmins(data.admins || []);
      setCurrentUser(data.currentUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingAdmin ? `/api/admin/manage` : '/api/admin/manage';
      const method = editingAdmin ? 'PUT' : 'POST';
      const body = editingAdmin 
        ? { ...formData, adminId: editingAdmin.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save admin');
      }

      await fetchAdmins();
      setShowAddModal(false);
      setEditingAdmin(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'admin',
        permissions: {
          canManageProducts: true,
          canManageOrders: true,
          canViewAnalytics: true,
          canManageAdmins: false,
          canManageSettings: false
        },
        isActive: true
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '',
      role: admin.role,
      permissions: admin.permissions || {
        canManageProducts: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManageAdmins: false,
        canManageSettings: false
      },
      isActive: admin.isActive
    });
    setShowAddModal(true);
  };

  const handleToggleActive = async (adminId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adminId,
          isActive: !currentStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update admin status');
      }

      await fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePermissionChange = (permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  if (loading && admins.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          {currentUser?.role === 'superadmin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Admin
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <li key={admin.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <UserCircleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {admin.username}
                        </p>
                        {admin.role === 'superadmin' && (
                          <ShieldCheckIcon className="h-4 w-4 text-red-500 ml-2" />
                        )}
                        {!admin.isActive && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                      <p className="text-xs text-gray-400">
                        Role: {admin.role} • Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentUser?.role === 'superadmin' && admin.id !== currentUser.id && (
                      <>
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(admin.id, admin.isActive)}
                          className={`${
                            admin.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {admin.isActive ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {admin.permissions && (
                  <div className="mt-3 ml-14">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(admin.permissions).map(([key, value]) => (
                        value && (
                          <span
                            key={key}
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add/Edit Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {editingAdmin && '(leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required={!editingAdmin}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      {Object.entries(formData.permissions).map(([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handlePermissionChange(key, e.target.checked)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingAdmin(null);
                        setFormData({
                          username: '',
                          email: '',
                          password: '',
                          role: 'admin',
                          permissions: {
                            canManageProducts: true,
                            canManageOrders: true,
                            canViewAnalytics: true,
                            canManageAdmins: false,
                            canManageSettings: false
                          },
                          isActive: true
                        });
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingAdmin ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
