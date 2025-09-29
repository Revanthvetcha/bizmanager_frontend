import { useState } from 'react';
import { Plus, Users, CreditCard, FileText, Mail, Phone, CreditCard as Edit, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';

export default function Payroll() {
  const { employees, payroll, addPayroll, updatePayroll, deletePayroll } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('directory');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    employee: any | null;
  }>({
    isOpen: false,
    employee: null
  });
  const [formData, setFormData] = useState({
    employee_id: '',
    month: '',
    year: '',
    basic_salary: '',
    allowances: '',
    deductions: '',
    net_salary: '',
    status: 'pending',
  });

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const totalSalaryBudget = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  
  // Calculate payroll metrics
  const totalPayrollAmount = payroll.reduce((sum, record) => sum + (record.net_salary || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payrollData = {
        ...formData,
        employee_id: parseInt(formData.employee_id),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        basic_salary: parseFloat(formData.basic_salary),
        allowances: parseFloat(formData.allowances || '0'),
        deductions: parseFloat(formData.deductions || '0'),
        net_salary: parseFloat(formData.net_salary),
      };

      if (editingEmployee) {
        await updatePayroll(editingEmployee, payrollData);
      } else {
        await addPayroll(payrollData);
      }

      resetForm();
    } catch (error) {
      console.error('Failed to save payroll:', error);
      alert('Failed to save payroll: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      month: '',
      year: '',
      basic_salary: '',
      allowances: '',
      deductions: '',
      net_salary: '',
      status: 'pending',
    });
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleEdit = (payrollRecord: any) => {
    setFormData({
      employee_id: payrollRecord.employee_id.toString(),
      month: payrollRecord.month.toString(),
      year: payrollRecord.year.toString(),
      basic_salary: payrollRecord.basic_salary.toString(),
      allowances: payrollRecord.allowances.toString(),
      deductions: payrollRecord.deductions.toString(),
      net_salary: payrollRecord.net_salary.toString(),
      status: payrollRecord.status,
    });
    setEditingEmployee(payrollRecord.id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDelete = (payrollRecord: any) => {
    setConfirmModal({
      isOpen: true,
      employee: payrollRecord
    });
  };

  const confirmDelete = () => {
    if (confirmModal.employee) {
      deletePayroll(confirmModal.employee.id);
    }
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      employee: null
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Payroll Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payroll Record
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Active Employees</h3>
              <p className="text-3xl font-bold mt-2">{activeEmployees.length}</p>
            </div>
            <Users className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Monthly Salary Budget</h3>
              <p className="text-3xl font-bold mt-2">₹{totalSalaryBudget.toLocaleString()}</p>
            </div>
            <CreditCard className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="bg-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Total Payroll</h3>
              <p className="text-3xl font-bold mt-2">₹{totalPayrollAmount.toLocaleString()}</p>
              <p className="text-sm opacity-75 mt-1">{payroll.length} records</p>
            </div>
            <FileText className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'directory'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Employee Directory
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'records'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Payroll Records
          </button>
        </nav>
      </div>

      {/* Employee Directory */}
      {activeTab === 'directory' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Employee Directory ({activeEmployees.length} employees)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {employee.name || 'Unknown Employee'}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {employee.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(employee)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete employee"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {employee.position || 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{employee.department || 'N/A'}</p>
                  {employee.location && (
                    <p className="text-gray-600 dark:text-gray-400">{employee.location}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Mail className="h-3 w-3" />
                    <span className="text-xs">{employee.email || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Phone className="h-3 w-3" />
                    <span className="text-xs">{employee.phone || 'N/A'}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Basic Salary
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{(employee.salary || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payroll Records */}
      {activeTab === 'records' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
            Payroll Records ({payroll.length} records)
          </h2>

          {payroll.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No payroll records found</p>
                <p className="text-sm">Create your first payroll record to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {payroll.map((record) => {
                const employee = employees.find(emp => emp.id === record.employee_id.toString());
                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee ? employee.name.charAt(0).toUpperCase() : 'E'}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {employee ? employee.name : `Employee #${record.employee_id}`}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {record.month}/{record.year}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                        <div className="flex space-x-4 text-sm mt-1">
                          <span className="text-gray-500 dark:text-gray-400">
                            Basic: ₹{record.basic_salary.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Allowances: ₹{record.allowances.toLocaleString()}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            Deductions: ₹{record.deductions.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                          ₹{record.net_salary.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Net Salary
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          title="Edit payroll"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          title="Delete payroll"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingEmployee ? "Edit Payroll Record" : "Add New Payroll Record"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee
              </label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Month</option>
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                required
                min="2020"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary
              </label>
              <input
                type="number"
                name="basic_salary"
                value={formData.basic_salary}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Basic salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Allowances
              </label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Allowances"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deductions
              </label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Deductions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Net Salary
              </label>
              <input
                type="number"
                name="net_salary"
                value={formData.net_salary}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                placeholder="Net salary"
              />
            </div>
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
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingEmployee ? 'Update Payroll' : 'Add Payroll'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${confirmModal.employee?.name}? This action cannot be undone and will permanently remove the employee from your system.`}
        confirmText="Delete Employee"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}