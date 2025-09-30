import { useState, useEffect } from 'react';
import { Download, DollarSign, TrendingUp, BarChart3, Package, Store, Calendar } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Reports() {
  const { sales, stores, employees, products, expenses, payroll } = useData();
  
  console.log('Reports component - sales data:', sales);
  console.log('Reports component - stores data:', stores);
  console.log('Reports component - employees data:', employees);
  console.log('Reports component - products data:', products);
  console.log('Reports component - expenses data:', expenses);
  console.log('Reports component - payroll data:', payroll);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('All Time');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Reset hovered point when filters change
  useEffect(() => {
    setHoveredPoint(null);
  }, [selectedStore, selectedPeriod]);

  // Filter sales based on selected store and time period
  const getFilteredSales = () => {
    let filtered = sales;

    // Filter by store
    if (selectedStore) {
      filtered = filtered.filter(sale => sale.store === selectedStore);
    }

    // Filter by time period only if a specific period is selected
    if (selectedPeriod && selectedPeriod !== 'All Time') {
      const now = new Date();
      let startDate = new Date();
      let endDate = new Date();

      switch (selectedPeriod) {
        case 'This Month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'Last Month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
          break;
        case 'This Quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
          break;
        case 'This Year':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        default:
          // No time filtering
          return filtered;
      }

      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date);
        // Handle invalid dates
        if (isNaN(saleDate.getTime())) {
          return false;
        }
        return saleDate >= startDate && saleDate <= endDate;
      });
    }

    return filtered;
  };

  const filteredSales = getFilteredSales();
  
  // Debug logging
  console.log('Reports - selectedStore:', selectedStore);
  console.log('Reports - selectedPeriod:', selectedPeriod);
  console.log('Reports - filteredSales count:', filteredSales.length);
  console.log('Reports - all sales count:', sales.length);

  // Calculate metrics with proper number handling
  const totalRevenue = filteredSales.reduce((sum, sale) => {
    const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) || 0 : (sale.amount || 0);
    return sum + amount;
  }, 0);
  
  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) || 0 : (expense.amount || 0);
    return sum + amount;
  }, 0);
  
  const netProfit = totalRevenue - totalExpenses;
  const avgOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  // Sales by store - show all stores when "All Stores" is selected, or just the selected store
  const salesByStore = (() => {
    if (selectedStore) {
      // Show only the selected store
      const store = stores.find(s => s.name === selectedStore);
      if (!store) return [];
      
      const revenue = filteredSales.filter(sale => sale.store === store.name).reduce((sum, sale) => {
        const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) || 0 : (sale.amount || 0);
        return sum + amount;
      }, 0);
      
      return [{ name: store.name, revenue }];
    } else {
      // Show all stores with their revenue
      return stores.map(store => ({
        name: store.name,
        revenue: filteredSales.filter(sale => sale.store === store.name).reduce((sum, sale) => {
          const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) || 0 : (sale.amount || 0);
          return sum + amount;
        }, 0)
      }));
    }
  })();
  
  // Debug logging for sales by store
  console.log('Reports - stores:', stores);
  console.log('Reports - filteredSales:', filteredSales);
  console.log('Reports - salesByStore:', salesByStore);

  // Sales trend - adapts based on selected time period
  const getSalesTrend = () => {
    if (selectedPeriod === 'All Time') {
      // For "All Time", show aggregated monthly data for all available months
      const monthlyData: Record<string, { revenue: number; salesCount: number }> = {};
      
      filteredSales.forEach(sale => {
        const saleDate = new Date(sale.date);
        if (isNaN(saleDate.getTime())) return;
        
        const monthKey = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
        const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) || 0 : (sale.amount || 0);
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, salesCount: 0 };
        }
        monthlyData[monthKey].revenue += amount;
        monthlyData[monthKey].salesCount += 1;
      });
      
      // Convert to array and sort by date
      return Object.entries(monthlyData)
        .map(([monthKey, data]) => {
          const [year, month] = monthKey.split('-').map(Number);
          const date = new Date(year, month);
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            revenue: data.revenue,
            salesCount: data.salesCount
          };
        })
        .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    } else {
      // For specific periods, show the last 12 months with filtered data
      const last12Months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthSales = filteredSales.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.getFullYear() === year && saleDate.getMonth() === month;
        });
        const monthRevenue = monthSales.reduce((sum, sale) => {
          const amount = typeof sale.amount === 'string' ? parseFloat(sale.amount) || 0 : (sale.amount || 0);
          return sum + amount;
        }, 0);

        last12Months.push({
          date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          revenue: monthRevenue,
          salesCount: monthSales.length
        });
      }
      return last12Months;
    }
  };

  const salesTrend = getSalesTrend();

  const handleExportPDF = () => {
    // Create a professional report content
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Business Report - ${new Date().toLocaleDateString()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .report-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
          }
          .company-name {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          .report-title {
            font-size: 20px;
            opacity: 0.9;
            font-weight: 300;
          }
          .generated-date {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 8px;
          }
          .content {
            padding: 40px;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .metric-card {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 24px;
            border-radius: 16px;
            text-align: center;
            border: 1px solid #e2e8f0;
            transition: transform 0.2s ease;
          }
          .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .metric-label {
            font-size: 14px;
            color: #718096;
            margin-bottom: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
          }
          .section-title {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
          }
          .store-list {
            background: #f8fafc;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .store-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .store-item:last-child {
            border-bottom: none;
          }
          .store-name {
            font-weight: 600;
            color: #2d3748;
          }
          .store-revenue {
            font-weight: 700;
            color: #667eea;
            font-size: 16px;
          }
          .footer {
            background: #2d3748;
            color: white;
            padding: 30px;
            text-align: center;
          }
          .footer p {
            margin-bottom: 8px;
            opacity: 0.9;
          }
          .chart-section {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 16px;
            padding: 30px;
            margin: 30px 0;
          }
          .chart-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
            text-align: center;
          }
          .progress-bar {
            background: #e2e8f0;
            border-radius: 10px;
            height: 20px;
            margin: 10px 0;
            overflow: hidden;
          }
          .progress-fill {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
          }
          .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-weight: 600;
            color: #4a5568;
          }
          @media print {
            body { background: white; padding: 0; }
            .report-container { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="company-name">BizManager</div>
            <div class="report-title">Business Analytics Report</div>
            <div class="generated-date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="content">
            <div class="metrics">
              <div class="metric-card">
                <div class="metric-label">Total Revenue</div>
                <div class="metric-value">₹${totalRevenue.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Total Expenses</div>
                <div class="metric-value">₹${totalExpenses.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Net Profit</div>
                <div class="metric-value">₹${netProfit.toLocaleString()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Avg Order Value</div>
                <div class="metric-value">₹${avgOrderValue.toLocaleString()}</div>
              </div>
            </div>

            <div class="chart-section">
              <div class="chart-title">📊 Sales by Store</div>
              <div class="store-list">
                ${salesByStore.map(store => {
                  const maxRevenue = Math.max(...salesByStore.map(s => s.revenue));
                  const percentage = maxRevenue > 0 ? (store.revenue / maxRevenue) * 100 : 0;
                  return `
                    <div class="store-item">
                      <div class="store-name">${store.name}</div>
                      <div class="store-revenue">₹${store.revenue.toLocaleString()}</div>
                    </div>
                    <div class="progress-label">
                      <span>${store.name}</span>
                      <span>${percentage.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div class="footer">
            <p>📈 Comprehensive Business Analytics</p>
            <p>For detailed insights and support, contact our team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Business-Report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Export */}
      <div className="flex items-center justify-end space-x-4">
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            selectedStore 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">All Stores</option>
          {stores.map(store => (
            <option key={store.id} value={store.name}>{store.name}</option>
          ))}
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
            selectedPeriod !== 'All Time'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="All Time">All Time</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
          <option value="This Quarter">This Quarter</option>
          <option value="This Year">This Year</option>
        </select>
        {(selectedStore || selectedPeriod !== 'All Time') && (
          <button
            onClick={() => {
              setSelectedStore('');
              setSelectedPeriod('All Time');
            }}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold mt-2">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Total Expenses</h3>
              <p className="text-3xl font-bold mt-2">₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Net Profit</h3>
              <p className="text-3xl font-bold mt-2">₹{isNaN(netProfit) ? '0' : netProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Avg Order Value</h3>
              <p className="text-3xl font-bold mt-2">₹{isNaN(avgOrderValue) ? '0' : avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Store */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Store className="h-5 w-5 text-blue-500 mr-2" />
            Sales by Store
          </h3>
          <div className="space-y-4">
            {(() => {
              // Check if there's any sales data at all
              const hasAnySales = salesByStore.some(store => store.revenue > 0);
              
              if (!hasAnySales) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedStore 
                        ? `No sales data available for ${selectedStore} in the selected period`
                        : 'No sales data available for the selected period'
                      }
                    </p>
                  </div>
                );
              }
              
              return salesByStore.map((store) => {
                const maxRevenue = Math.max(...salesByStore.map(s => s.revenue));
                const percentage = maxRevenue > 0 ? (store.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={store.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{store.name}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{store.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
            Expenses by Category
          </h3>
          <div className="space-y-4">
            {(() => {
              const categoryTotals = expenses.reduce((acc, expense) => {
                const category = expense.category || 'Uncategorized';
                const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) || 0 : (expense.amount || 0);
                if (acc[category]) {
                  acc[category] += amount;
                } else {
                  acc[category] = amount;
                }
                return acc;
              }, {} as Record<string, number>);
              
              const categories = Object.entries(categoryTotals);
              
              if (categories.length === 0) {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No expense data available for the selected period</p>
                  </div>
                );
              }
              
              const maxAmount = Math.max(...categories.map(([, amount]) => amount));
              
              return categories.map(([category, amount]) => {
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>

      {/* Sales Trend - Interactive Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Calendar className="h-5 w-5 text-green-500 mr-2" />
          Monthly Sales Trend
        </h3>

        <div className="relative">
          {/* Chart Container */}
          <div className="h-80 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 800 300">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Chart Area */}
              {salesTrend.length > 0 && (() => {
                const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
                const minRevenue = Math.min(...salesTrend.map(d => d.revenue));
                const range = maxRevenue - minRevenue || 1;
                const padding = 40;
                const chartWidth = 800 - (padding * 2);
                const chartHeight = 300 - (padding * 2);
                const pointSpacing = chartWidth / (salesTrend.length - 1);

                // Create path for line
                const pathData = salesTrend.map((point, index) => {
                  const x = padding + (index * pointSpacing);
                  const y = padding + chartHeight - ((point.revenue - minRevenue) / range) * chartHeight;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');

                // Create area under line
                const areaData = salesTrend.map((point, index) => {
                  const x = padding + (index * pointSpacing);
                  const y = padding + chartHeight - ((point.revenue - minRevenue) / range) * chartHeight;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ') + ` L ${padding + (salesTrend.length - 1) * pointSpacing} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`;

                return (
                  <>
                    {/* Area under line */}
                    <path
                      d={areaData}
                      fill="url(#gradient)"
                      opacity="0.3"
                    />

                    {/* Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {salesTrend.map((point, index) => {
                      const x = padding + (index * pointSpacing);
                      const y = padding + chartHeight - ((point.revenue - minRevenue) / range) * chartHeight;
                      const isHovered = hoveredPoint === index;

                      return (
                        <g key={index}>
                          {/* Hover area (invisible but larger for easier interaction) */}
                          <circle
                            cx={x}
                            cy={y}
                            r="15"
                            fill="transparent"
                            onMouseEnter={() => {
                              setHoveredPoint(index);
                            }}
                            onMouseLeave={() => {
                              setHoveredPoint(null);
                            }}
                            style={{ cursor: 'default' }}
                          />

                          {/* Data point */}
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? "6" : "4"}
                            fill={isHovered ? "#059669" : "#10b981"}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-200"
                          />
                        </g>
                      );
                    })}

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                  </>
                );
              })()}
            </svg>

            {/* Tooltip */}
            {hoveredPoint !== null && hoveredPoint >= 0 && hoveredPoint < salesTrend.length && (
              <div 
                className="absolute bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg p-3 pointer-events-none z-10"
                style={{
                  left: `${(hoveredPoint / (salesTrend.length - 1)) * 100}%`,
                  top: '20px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-semibold">{salesTrend[hoveredPoint]?.fullDate}</div>
                <div className="text-green-400">Revenue: ₹{salesTrend[hoveredPoint]?.revenue.toLocaleString()}</div>
                <div className="text-gray-300">Sales: {salesTrend[hoveredPoint]?.salesCount}</div>

                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
              </div>
            )}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
            {salesTrend.map((point, index) => (
              <div key={index} className="text-center">
                {point.date}
              </div>
            ))}
          </div>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 py-10">
            {(() => {
              const maxRevenue = Math.max(...salesTrend.map(d => d.revenue));
              const minRevenue = Math.min(...salesTrend.map(d => d.revenue));
              const range = maxRevenue - minRevenue || 1;
              const steps = 5;
              const stepValue = range / steps;

              return Array.from({ length: steps + 1 }, (_, i) => {
                const value = minRevenue + (stepValue * i);
                return (
                  <div key={i} className="text-right">
                    ₹{(value / 1000).toFixed(0)}k
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}