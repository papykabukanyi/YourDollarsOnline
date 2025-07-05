'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function MobileAdminNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, permission: null },
    { name: 'Products', href: '/admin/products', icon: CubeIcon, permission: 'manage_products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon, permission: 'manage_orders' },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, permission: 'view_analytics' },
    { name: 'Admins', href: '/admin/admins', icon: UserGroupIcon, permission: 'manage_admins' },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, permission: 'manage_settings' },
  ];

  const isActive = (href) => pathname === href;

  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile Admin Header */}
      <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-lg font-bold">
              <span className="text-primary-600">Admin</span>
              <span className="text-gray-900">Panel</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <ShieldCheckIcon className="h-4 w-4 text-primary-600" />
              </div>
              <div className="hidden xs:block">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <Bars3Icon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Admin Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-72 bg-white shadow-xl animate-slide-down">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <ShieldCheckIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 mb-2"
                >
                  <HomeIcon className="h-5 w-5 mr-3" />
                  View Store
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile Admin */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 py-2">
          {filteredNavigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom navigation */}
      <div className="lg:hidden h-16"></div>
    </>
  );
}
