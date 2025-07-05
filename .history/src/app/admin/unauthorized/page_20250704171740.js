'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/admin/dashboard');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You don&apos;t have permission to access this page.
          </p>
        </div>

        {user && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Current User:</strong> {user.username}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Role:</strong> {user.role}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Permissions:</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {user.permissions?.map(permission => (
                <span key={permission} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {permission.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>If you believe this is an error, please contact the system administrator.</p>
        </div>
      </div>
    </div>
  );
}
