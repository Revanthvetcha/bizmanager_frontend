import { useState } from 'react';
import { Plus, Search, FileText, Download } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';

export default function Sales() {
  const { sales, stores, addSale, loading } = useData();
  
  console.log('Sales component - sales data:', sales);
  console.log('Sales component - stores data:', stores);
  console.log('Sales component - stores length:', stores?.length);
  console.log('Sales component - loading state:', loading);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading sales data...</p>
        </div>
      </div>
    );
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    store: '',
    timePeriod: '',
    status: ''
  });

  console.log('Sales component - current filters:', filters);
  const [formData, setFormData] = useState({
    customer: '',
    store: '',
    amount: '',
    phone: '',
    location: '',
    items: '',
    paymentMethod: 'Cash',
    advance: '',
    status: 'Pending Payment',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      // Validate required fields
      if (!formData.customer || !formData.store || !formData.amount || !formData.items) {
        alert('Please fill in all required fields');
        return;
      }

      const saleData = {
        ...formData,
        amount: parseFloat(formData.amount),
        items: parseInt(formData.items),
        advance: parseFloat(formData.advance || '0'),
        balance: parseFloat(formData.amount) - parseFloat(formData.advance || '0'),
        date: new Date().toISOString().split('T')[0],
      };
      
      console.log('Sending sale data:', saleData);
      await addSale(saleData);
      console.log('Sale created successfully');
      
      setFormData({
        customer: '',
        store: '',
        amount: '',
        phone: '',
        location: '',
        items: '',
        paymentMethod: 'Cash',
        advance: '',
        status: 'Pending Payment',
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create sale:', error);
      alert('Failed to create sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Filter sales based on current filters
  const filteredSales = sales.filter(sale => {
    console.log('Filtering sale:', sale.customer, 'Store:', sale.store, 'Selected store filter:', filters.store);
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        (sale.customer && typeof sale.customer === 'string' && sale.customer.toLowerCase().includes(searchTerm)) ||
        (sale.phone && typeof sale.phone === 'string' && sale.phone.includes(searchTerm)) ||
        (sale.id && String(sale.id).toLowerCase().includes(searchTerm)) ||
        (sale.billId && String(sale.billId).toLowerCase().includes(searchTerm));
      if (!matchesSearch) return false;
    }

    // Store filter
    if (filters.store && sale.store !== filters.store) {
      console.log('Store filter: Sale store:', sale.store, 'Filter store:', filters.store, 'Match:', sale.store === filters.store);
      return false;
    }

    // Time period filter
    if (filters.timePeriod && sale.date) {
      const saleDate = new Date(sale.date);
      // Check if date is valid
      if (!isNaN(saleDate.getTime())) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        switch (filters.timePeriod) {
          case 'Today':
            if (saleDate < today) return false;
            break;
          case 'This Week':
            if (saleDate < thisWeek) return false;
            break;
          case 'This Month':
            if (saleDate < thisMonth) return false;
            break;
        }
      }
    }

    // Status filter
    if (filters.status && sale.status !== filters.status) {
      return false;
    }

    return true;
  });

  console.log('Filtered sales count:', filteredSales.length, 'Total sales:', sales.length);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending Payment':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleDownloadInvoice = (sale: any) => {
    // Create invoice content
      const invoiceContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${sale.billId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', 'Helvetica', sans-serif; 
              background: #f5f5f5;
              padding: 20px;
              line-height: 1.4;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border: 1px solid #ddd;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: #2c3e50;
              color: white;
              padding: 30px;
              text-align: center;
              border-bottom: 3px solid #3498db;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .company-tagline {
              font-size: 14px;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              border-bottom: 2px solid #ecf0f1;
              padding-bottom: 20px;
            }
            .bill-to, .invoice-info {
              flex: 1;
            }
            .bill-to {
              margin-right: 40px;
            }
            .section-title {
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 15px;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .info-item {
              margin-bottom: 8px;
              color: #34495e;
              font-size: 14px;
            }
            .info-item strong {
              color: #2c3e50;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
              background: white;
              border: 1px solid #ddd;
            }
            .items-table th {
              background: #34495e;
              color: white;
              padding: 12px 15px;
              text-align: left;
              font-weight: bold;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .items-table td {
              padding: 12px 15px;
              border-bottom: 1px solid #ecf0f1;
              color: #2c3e50;
              font-size: 14px;
            }
            .items-table tr:nth-child(even) {
              background: #f8f9fa;
            }
            .items-table tr:last-child td {
              border-bottom: 2px solid #34495e;
            }
            .total-section {
              margin-top: 30px;
              text-align: right;
            }
            .total-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              color: #2c3e50;
              font-size: 14px;
              padding: 5px 0;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              color: #2c3e50;
              padding: 15px 0;
              border-top: 2px solid #34495e;
              margin-top: 10px;
              display: flex;
              justify-content: space-between;
            }
            .payment-info {
              margin-top: 20px;
              padding: 15px;
              background: #ecf0f1;
              border-left: 4px solid #3498db;
            }
            .payment-info strong {
              color: #2c3e50;
            }
            .footer {
              background: #34495e;
              color: white;
              padding: 20px 30px;
              text-align: center;
              font-size: 14px;
            }
            .footer p {
              margin-bottom: 5px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 3px;
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending {
              background: #f39c12;
              color: white;
            }
            .status-delivered {
              background: #27ae60;
              color: white;
            }
            .status-processing {
              background: #3498db;
              color: white;
            }
            .invoice-number {
              font-size: 24px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="company-name">BizManager</div>
              <div class="company-tagline">Professional Business Suite</div>
            </div>

            <div class="content">
              <div class="invoice-header">
                <div class="bill-to">
                  <div class="section-title">Bill To</div>
                  <div class="info-item"><strong>${sale.customer}</strong></div>
                  <div class="info-item">Phone: ${sale.phone}</div>
                  <div class="info-item">Address: ${sale.location}</div>
                </div>
                <div class="invoice-info">
                  <div class="invoice-number">INVOICE</div>
                  <div class="info-item"><strong>Invoice #:</strong> ${sale.billId}</div>
                  <div class="info-item"><strong>Order #:</strong> ${sale.id}</div>
                  <div class="info-item"><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</div>
                  <div class="info-item"><strong>Store:</strong> ${sale.store}</div>
                  <div class="info-item">
                    <strong>Status:</strong> 
                    <span class="status-badge status-${sale.status.toLowerCase().replace(' ', '')}">${sale.status}</span>
                  </div>
                </div>
              </div>

              <table class="items-table">
                <thead>
                  <tr>
                    <th style="width: 50%;">Description</th>
                    <th style="width: 15%; text-align: center;">Qty</th>
                    <th style="width: 20%; text-align: right;">Rate</th>
                    <th style="width: 15%; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Items</td>
                    <td style="text-align: center;">${Array.isArray(sale.items) ? sale.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0) : sale.items}</td>
                    <td style="text-align: right;">₹${Array.isArray(sale.items) ? ((sale.amount || 0) / sale.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0)).toFixed(2) : ((sale.amount || 0) / sale.items).toFixed(2)}</td>
                    <td style="text-align: right; font-weight: bold;">₹${(sale.amount || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div class="total-section">
                <div class="total-item">
                  <span>Subtotal:</span>
                  <span>₹${(sale.amount || 0).toLocaleString()}</span>
                </div>
                ${sale.advance > 0 ? `
                <div class="total-item">
                  <span>Advance Paid:</span>
                  <span>₹${sale.advance.toLocaleString()}</span>
                </div>
                <div class="total-item">
                  <span>Balance Due:</span>
                  <span>₹${(sale.balance || 0).toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="total-row">
                  <span>Total Amount:</span>
                  <span>₹${(sale.amount || 0).toLocaleString()}</span>
                </div>
              </div>

              <div class="payment-info">
                <strong>Payment Method:</strong> ${sale.paymentMethod}
              </div>
            </div>

            <div class="footer">
              <p>Thank you for your business!</p>
              <p>For any queries, please contact us.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${sale.billId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* New Sale Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name, phone, order ID"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Store Filter */}
          <div className="relative min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Store Filter
            </label>
            <select 
              name="store"
              value={filters.store}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700 pr-8"
            >
              <option value="">All Stores</option>
              {stores && stores.length > 0 ? (
                stores.map(store => (
                  <option key={store.id} value={store.name}>{store.name}</option>
                ))
              ) : loading ? (
                <option value="" disabled>Loading stores...</option>
              ) : (
                <option value="" disabled>No stores available</option>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Time Period Filter */}
          <div className="relative min-w-[120px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Time Period
            </label>
            <select 
              name="timePeriod"
              value={filters.timePeriod}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700 pr-8"
            >
              <option value="">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Order Status
            </label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700 pr-8"
            >
              <option value="">All Orders</option>
              <option value="Delivered">Delivered</option>
              <option value="Pending Payment">Pending Payment</option>
              <option value="Processing">Processing</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setFilters({ search: '', store: '', timePeriod: '', status: '' })}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 text-green-500 mr-2" />
          Sales History ({filteredSales.length} sales)
        </h2>

        <div className="space-y-4">
          {filteredSales.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No sales found</p>
                <p className="text-sm">Create your first sale to get started</p>
              </div>
            </div>
          ) : (
            filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-semibold">
                  {sale.id ? String(sale.id).slice(-2) : 'N/A'}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {sale.customer}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {sale.store}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Order #{sale.id || 'N/A'} • Bill #{sale.billId || 'N/A'}</span>
                    <span>{sale.phone || 'N/A'}</span>
                    <span>{sale.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm mt-1">
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 rounded-full text-xs">
                      {sale.paymentMethod}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {sale.date ? new Date(sale.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {sale.advance > 0 && (
                    <div className="flex space-x-4 text-sm mt-1">
                      <span className="text-green-600 dark:text-green-400">
                        Advance: ₹{sale.advance}
                      </span>
                      <span className="text-red-600 dark:text-red-400">
                        Balance: ₹{sale.balance || 0}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right flex items-center space-x-4">
                <div>
                  <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                    ₹{(sale.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {Array.isArray(sale.items) ? sale.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0) : sale.items} item{(Array.isArray(sale.items) ? sale.items.reduce((total: number, item: any) => total + (item.quantity || 0), 0) : sale.items) !== 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  onClick={() => handleDownloadInvoice(sale)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  title="Download Invoice"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sale"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store
              </label>
              <select
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.name}>{store.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="Customer location"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Items
              </label>
              <input
                type="number"
                name="items"
                value={formData.items}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Advance Payment
              </label>
              <input
                type="number"
                name="advance"
                value={formData.advance}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Partial Payment">Partial Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Pending Payment">Pending Payment</option>
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              Create Sale
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}