import { useState } from 'react';
import { Plus, DollarSign, Calendar, Download, Edit, Trash2, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function Expenses() {
  const { expenses, stores, addExpense, updateExpense, deleteExpense } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    expense: any | null;
  }>({
    isOpen: false,
    expense: null
  });
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    store: '',
    date: '',
    receiptUrl: '',
    notes: '',
  });

  // Calculate metrics with proper number parsing
  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    return sum + amount;
  }, 0);
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, expense) => {
    const amount = parseFloat(expense.amount) || 0;
    return sum + amount;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      alert('Please enter an expense name');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (!formData.store) {
      alert('Please select a store');
      return;
    }
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      
      console.log('Expenses: Submitting expense data:', expenseData);
      
      if (editingExpense) {
        await updateExpense(editingExpense, expenseData);
        console.log('Expenses: Expense updated successfully');
      } else {
        await addExpense(expenseData);
        console.log('Expenses: Expense added successfully');
      }
      resetForm();
    } catch (error) {
      console.error('Expenses: Failed to save expense:', error);
      alert(`Failed to save expense: ${error.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      category: '',
      store: '',
      date: '',
      receiptUrl: '',
      notes: '',
    });
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense: any) => {
    setFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      store: expense.store,
      date: expense.date,
      receiptUrl: expense.receiptUrl,
      notes: expense.notes,
    });
    setEditingExpense(expense.id);
    setIsModalOpen(true);
  };

  const handleDelete = (expense: any) => {
    setConfirmModal({
      isOpen: true,
      expense: expense
    });
  };

  const confirmDelete = () => {
    if (confirmModal.expense) {
      deleteExpense(confirmModal.expense.id);
    }
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      expense: null
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleExportPDF = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense Report - ${new Date().toLocaleDateString()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
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
          .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
          }
          .summary-card {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            padding: 24px;
            border-radius: 16px;
            text-align: center;
            border: 1px solid #fed7d7;
            transition: transform 0.2s ease;
          }
          .summary-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .summary-label {
            font-size: 14px;
            color: #c53030;
            margin-bottom: 8px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-value {
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
          }
          .expense-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
          .expense-table th {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
          }
          .expense-table td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #4a5568;
          }
          .expense-table tr:hover {
            background: #fef5e7;
          }
          .category-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .category-rent {
            background: #fed7d7;
            color: #c53030;
          }
          .category-utilities {
            background: #c6f6d5;
            color: #2f855a;
          }
          .category-office {
            background: #bee3f8;
            color: #2b6cb0;
          }
          .category-marketing {
            background: #e9d8fd;
            color: #805ad5;
          }
          .category-other {
            background: #f7fafc;
            color: #4a5568;
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
            <div class="report-title">Expense Tracking Report</div>
            <div class="generated-date">Generated on ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="content">
            <div class="summary">
              <div class="summary-card">
                <div class="summary-label">Total Expenses</div>
                <div class="summary-value">₹${totalExpenses.toLocaleString()}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">This Month</div>
                <div class="summary-value">₹${thisMonthExpenses.toLocaleString()}</div>
              </div>
            </div>

            <table class="expense-table">
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Store</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map(expense => `
                  <tr>
                    <td><strong>${expense.name}</strong></td>
                    <td><span class="category-badge category-${expense.category.toLowerCase().replace(' ', '')}">${expense.category}</span></td>
                    <td>${expense.store}</td>
                    <td>${new Date(expense.date).toLocaleDateString()}</td>
                    <td><strong>₹${expense.amount.toLocaleString()}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>💰 Comprehensive Expense Tracking</p>
            <p>For detailed financial insights and support, contact our team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Expense-Report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'rent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'utilities':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'office supplies':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'marketing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Expense Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Expense
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Total Expenses</h3>
              <p className="text-3xl font-bold mt-2">₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">This Month</h3>
              <p className="text-3xl font-bold mt-2">₹{thisMonthExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Export Data</h3>
              <button
                onClick={handleExportPDF}
                className="mt-2 inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </button>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Expense Records */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <DollarSign className="h-5 w-5 text-red-500 mr-2" />
          Expense Records ({expenses.length} entries)
        </h2>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 hover:shadow-md"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {expense.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{expense.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {expense.store}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    ₹{expense.amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Edit expense"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    title="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingExpense ? "Edit Expense" : "Add New Expense"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.name}>{store.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expense Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expense Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter expense description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Receipt URL (Optional)
            </label>
            <input
              type="url"
              name="receiptUrl"
              value={formData.receiptUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/receipt.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Additional notes about this expense"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingExpense ? "Update Expense" : "Save Expense"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${confirmModal.expense?.name}"? This action cannot be undone.`}
        confirmText="Delete Expense"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}