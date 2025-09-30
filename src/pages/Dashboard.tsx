import { 
  Store, 
  DollarSign, 
  Users, 
  Package, 
  TrendingUp, 
  Target
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { stores, employees, products, sales, expenses, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const todaysSales = sales.filter(sale => sale && sale.date === new Date().toISOString().split('T')[0]);
  const totalSalesToday = todaysSales.reduce((sum, sale) => sum + (sale?.amount || 0), 0);
  
  // Calculate monthly expenses from current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + (expense?.amount || 0), 0);
  const revenueGoal = 250000;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale?.amount || 0), 0);
  const goalAchieved = Math.round((totalRevenue / revenueGoal) * 100);

  const stats = [
    {
      title: 'Total Stores',
      value: stores.length,
      subtitle: `+${stores.filter(store => 
        new Date(store.createdAt).getMonth() === new Date().getMonth()
      ).length} this month`,
      icon: Store,
      color: 'blue',
    },
    {
      title: "Today's Sales",
      value: todaysSales.length,
      subtitle: `₹${totalSalesToday.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Employees',
      value: employees.filter(emp => emp.status === 'active').length,
      subtitle: 'Active workforce',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Inventory Items',
      value: products.length,
      subtitle: 'Across all stores',
      icon: Package,
      color: 'orange',
    },
    {
      title: 'Monthly Expenses',
      value: `₹${monthlyExpenses.toLocaleString()}`,
      subtitle: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      icon: TrendingUp,
      color: 'red',
    },
    {
      title: 'Revenue Goal',
      value: `₹${revenueGoal.toLocaleString()}`,
      subtitle: `${goalAchieved}% achieved`,
      icon: Target,
      color: 'blue',
    },
  ];

  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Sales Activity
          </h2>
        </div>

        <div className="space-y-4">
          {sales && sales.length > 0 ? (
            sales.slice(0, 3).map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {sale.customer ? sale.customer.slice(0, 2).toUpperCase() : 'N/A'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{sale.customer || 'Unknown Customer'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bill #{sale.billId ? sale.billId.split('-')[1] : 'N/A'} • {sale.phone || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    ₹{(sale.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No sales data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}