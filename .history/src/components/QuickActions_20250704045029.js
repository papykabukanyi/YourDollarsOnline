import Link from 'next/link';
import { 
  PlusIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function QuickActions() {
  const actions = [
    {
      name: 'Add Product',
      description: 'Add a new product to your store',
      href: '/admin/products/add',
      icon: PlusIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'View Orders',
      description: 'Manage customer orders',
      href: '/admin/orders',
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Manage Admins',
      description: 'Add or remove admin users',
      href: '/admin/admins',
      icon: UsersIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Analytics',
      description: 'View sales and traffic reports',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      name: 'Settings',
      description: 'Configure store settings',
      href: '/admin/settings',
      icon: CogIcon,
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className={`p-3 rounded-full ${action.color} group-hover:scale-110 transition-transform duration-200`}>
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                {action.name}
              </h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
