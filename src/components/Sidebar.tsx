import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, DollarSign, Users, TrendingUp, Package, FileText, Building2, Settings, User, Menu } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Modal from './Modal';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    activeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    activeIconColor: 'text-blue-600 dark:text-blue-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Stores', 
    href: '/stores', 
    icon: Store,
    activeColor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    activeIconColor: 'text-green-600 dark:text-green-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Sales', 
    href: '/sales', 
    icon: DollarSign,
    activeColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    activeIconColor: 'text-yellow-600 dark:text-yellow-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Payroll', 
    href: '/payroll', 
    icon: Users,
    activeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    activeIconColor: 'text-purple-600 dark:text-purple-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Expenses', 
    href: '/expenses', 
    icon: TrendingUp,
    activeColor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    activeIconColor: 'text-red-600 dark:text-red-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package,
    activeColor: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    activeIconColor: 'text-indigo-600 dark:text-indigo-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileText,
    activeColor: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
    activeIconColor: 'text-teal-600 dark:text-teal-400',
    hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-700/50',
    defaultColor: 'text-gray-600 dark:text-gray-300'
  },
];

interface SidebarProps {
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { stores, addSale } = useData();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.customer || !formData.store || !formData.amount || !formData.items) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const saleData = {
        ...formData,
        amount: parseFloat(formData.amount),
        items: parseInt(formData.items),
        advance: parseFloat(formData.advance || '0'),
        balance: parseFloat(formData.amount) - parseFloat(formData.advance || '0'),
        date: new Date().toISOString().split('T')[0],
      };
      
      console.log('Sidebar: Creating sale with data:', saleData);
      await addSale(saleData);
      console.log('Sidebar: Sale created successfully');
      
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
      console.error('Sidebar: Failed to create sale:', error);
      alert('Failed to create sale: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-xl ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      
      {/* Header with Improved Logo Section */}
      <div className={`relative overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'p-3' : 'p-4'
      }`}>
        <div className="relative flex items-center justify-between">
          {/* Logo Section - Only show when NOT collapsed */}
          {!isCollapsed && (
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Enhanced Logo Icon */}
              <div className="flex items-center justify-center flex-shrink-0 transition-all duration-300 w-10 h-10">
                <Building2 className="h-6 w-6 text-gray-800 dark:text-white transition-all duration-300" />
              </div>
              
              {/* Logo Text */}
              <div className="transition-all duration-300 overflow-hidden">
                <h2 className="text-base font-bold text-gray-800 dark:text-white whitespace-nowrap">BizManager</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">Pro Business Suite</p>
              </div>
            </div>
          )}
          
          {/* Toggle Collapse Button - Only show on desktop */}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 group ring-1 ring-gray-300 dark:ring-gray-600 flex-shrink-0 ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
      
      <nav className={`space-y-1 flex-1 py-4 transition-all duration-300 ${
        isCollapsed ? 'px-2' : 'px-4'
      }`}>
        {!isCollapsed && (
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">
            MENU
          </div>
        )}
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => {
              // Close sidebar on mobile when navigating, keep open on desktop
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
            className={({ isActive }) =>
              `group flex items-center rounded-xl text-sm font-medium transition-all duration-300 ${
                isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-4 py-3'
              } ${
                isActive
                  ? `${item.activeColor} shadow-lg border-l-4 border-white/30 dark:border-gray-600/30`
                  : `${item.defaultColor} ${item.hoverColor} hover:shadow-md active:scale-95 lg:hover:scale-105`
              }`}
            title={isCollapsed ? item.name : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`transition-all duration-300 ${
                  isCollapsed ? 'h-5 w-5' : 'h-5 w-5 group-hover:scale-110'
                } ${isActive ? item.activeIconColor : item.defaultColor}`} />
                {!isCollapsed && (
                  <span className="transition-all duration-300 group-hover:font-semibold">{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {!isCollapsed && (
        <div className="px-6 py-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            QUICK ACTIONS - SALE
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            New Sale
          </button>
        </div>
      )}
      
      {isCollapsed && (
        <div className="px-2 py-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
            title="New Sale"
          >
            <span className="text-lg">+</span>
          </button>
        </div>
      )}

      {/* User Info Section */}
      <div className={`border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'px-2 py-3' : 'px-4 py-3'
      }`} ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className={`w-full rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group ${
              isCollapsed ? 'flex justify-center p-3' : 'flex items-center space-x-3 p-3'
            }`}
          >
            {/* Avatar with Profile Image */}
            <div className="relative">
              <div className={`bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white dark:ring-gray-800 transition-all duration-300 ${
                isCollapsed ? 'w-10 h-10' : 'w-12 h-12'
              }`}>
                <User className={`text-gray-800 dark:text-white transition-all duration-300 ${
                  isCollapsed ? 'h-5 w-5' : 'h-6 w-6'
                }`} />
              </div>
              {/* Online Status Indicator */}
              <div className={`absolute bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCollapsed ? '-bottom-1 -right-1 w-3 h-3' : '-bottom-1 -right-1 w-4 h-4'
              }`}>
                <div className={`bg-white rounded-full animate-pulse transition-all duration-300 ${
                  isCollapsed ? 'w-1 h-1' : 'w-2 h-2'
                }`}></div>
              </div>
            </div>
            
            {/* User Info - Only show when not collapsed */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Revanth
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  revanth@gmail.com
                </p>
              </div>
            )}
            
            {/* Dropdown Arrow - Only show when not collapsed */}
            {!isCollapsed && (
              <div className={`transform transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </button>

          {/* User Dropdown */}
          {isUserDropdownOpen && (
            <>
              {/* Mobile overlay for collapsed state */}
              {isCollapsed && (
                <div 
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
              )}
              <div className={`absolute bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200 ${
                isCollapsed 
                  ? 'bottom-0 left-full ml-2 w-64' 
                  : 'bottom-full left-0 right-0 mb-2'
              }`}>
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                    <User className="h-5 w-5 text-gray-800 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Revanth
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      revanth@gmail.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    navigate('/settings');
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                    <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">Account Settings</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage your profile</p>
                  </div>
                </button>
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Sale"
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store *
                </label>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="">Select a store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.name}>{store.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="Enter customer location"
                />
              </div>
            </div>
          </div>

          {/* Sale Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Sale Details
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Amount *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Items *
                </label>
                <input
                  type="number"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Create Sale
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
