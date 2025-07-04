import { 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function DashboardStats({ stats }) {
  const statCards = [
    {
      name: 'Total Products',
      value: stats?.products || 0,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Orders',
      value: stats?.orders || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Total Admins',
      value: stats?.admins || 0,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    },
    {
      name: 'Monthly Revenue',
      value: `$${stats?.revenue?.month?.toLocaleString() || '0'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-full`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}
