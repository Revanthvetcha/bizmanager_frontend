import { useState } from 'react';
import { Plus, Users, CreditCard, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';

export default function Payroll() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, stores } = useData();
  const { user, token } = useAuth();

  // Show authentication required message
  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view payroll data.</p>
        </div>
      </div>
    );
  }

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    address: '',
    hire_date: '',
    salary: '',
    allowances: '',
    status: 'active',
    store_id: '',
  });

  const activeEmployees = employees.filter(emp => emp.status === 'active');
  const totalSalaryBudget = activeEmployees.reduce((sum, emp) => {
    const salary = typeof emp.salary === 'string' ? parseFloat(emp.salary) || 0 : (emp.salary || 0);
    return sum + salary;
  }, 0);


  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...employeeFormData,
        salary: parseFloat(employeeFormData.salary),
        allowances: parseFloat(employeeFormData.allowances || '0'),
        store_id: employeeFormData.store_id || undefined,
        joinDate: employeeFormData.hire_date,
      };

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      resetEmployeeForm();
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert('Failed to save employee: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };


  const resetEmployeeForm = () => {
    setEmployeeFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      address: '',
      hire_date: '',
      salary: '',
      allowances: '',
      status: 'active',
      store_id: '',
    });
    setEditingEmployee(null);
    setIsEmployeeModalOpen(false);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || '',
      address: employee.address || '',
      hire_date: employee.joinDate || '',
      salary: employee.salary?.toString() || '',
      allowances: employee.allowances?.toString() || '',
      status: employee.status || 'active',
      store_id: employee.store_id?.toString() || '',
    });
    setIsEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };



  const handleEmployeeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setEmployeeFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="space-y-6">
      {/* Add Employee Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEmployeeModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium opacity-90">Monthly Salary Budget</h3>
              <p className="text-2xl font-bold mt-2 truncate">₹{totalSalaryBudget.toLocaleString('en-IN')}</p>
            </div>
            <CreditCard className="h-10 w-10 opacity-80 flex-shrink-0 ml-4" />
          </div>
        </div>
      </div>


      {/* Employee Directory */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            Employee Directory ({activeEmployees.length} employees)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="Edit Employee"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete Employee"
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
                    <p className="text-lg font-bold text-green-600 dark:text-green-400 truncate">
                      ₹{(employee.salary || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>



      {/* Add/Edit Employee Modal */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={resetEmployeeForm}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        size="lg"
      >
        <form onSubmit={handleEmployeeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={employeeFormData.name}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={employeeFormData.email}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={employeeFormData.phone}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Store
              </label>
              <select
                name="store_id"
                value={employeeFormData.store_id}
                onChange={handleEmployeeInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a store</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={employeeFormData.position}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter position"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={employeeFormData.department}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter department"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={employeeFormData.address}
              onChange={handleEmployeeInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Joining Date
              </label>
              <input
                type="date"
                name="hire_date"
                value={employeeFormData.hire_date}
                onChange={handleEmployeeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={employeeFormData.status}
                onChange={handleEmployeeInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary (₹)
              </label>
              <input
                type="number"
                name="salary"
                value={employeeFormData.salary}
                onChange={handleEmployeeInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Allowances (₹)
              </label>
              <input
                type="number"
                name="allowances"
                value={employeeFormData.allowances}
                onChange={handleEmployeeInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={resetEmployeeForm}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}