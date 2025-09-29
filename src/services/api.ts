const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    console.log('API Service: Initialized with token:', this.token ? 'Present' : 'Missing');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    this.token = localStorage.getItem('token');
    
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('API Service: Using token:', this.token.substring(0, 20) + '...');
    } else {
      console.log('API Service: No token found');
    }

    console.log('API Service: Making request to:', url);
    console.log('API Service: Request headers:', headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API Service: Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      console.error('API Service: Request failed:', error);
      throw new Error(error.error || 'Request failed');
    }

    const result = await response.json();
    console.log('API Service: Request successful:', result);
    return result;
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  async updateProfile(data: { name?: string; phone?: string; photoURL?: string }) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        photo_url: data.photoURL
      }),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async verifyToken() {
    return this.request('/api/auth/verify');
  }

  // Stores methods
  async getStores() {
    return this.request('/api/stores');
  }

  async createStore(data: { name: string; address: string; phone: string; gstin: string }) {
    return this.request('/api/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStore(id: string, data: { name: string; address: string; phone: string; gstin: string }) {
    return this.request(`/api/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStore(id: string) {
    return this.request(`/api/stores/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales methods
  async getSales() {
    return this.request('/api/sales');
  }

  async createSale(data: {
    customer: string;
    phone: string;
    location: string;
    store: string;
    amount: number;
    items: number;
    paymentMethod: string;
    advance: number;
    status: string;
  }) {
    console.log('API Service: Creating sale with data:', data);
    try {
      const result = await this.request('/api/sales', {
        method: 'POST',
        body: JSON.stringify({
          customer: data.customer,
          phone: data.phone,
          location: data.location,
          store: data.store,
          amount: data.amount,
          items: data.items,
          paymentMethod: data.paymentMethod,
          advance: data.advance,
          status: data.status,
        }),
      });
      console.log('API Service: Sale created successfully:', result);
      return result;
    } catch (error) {
      console.error('API Service: Failed to create sale:', error);
      throw error;
    }
  }

  // Employees methods
  async getEmployees() {
    return this.request('/api/employees');
  }

  async createEmployee(data: {
    name: string;
    email: string;
    phone: string;
    position: string;
    salary: number;
    hire_date: string;
    status: string;
    store_id?: number;
    user_id?: number;
  }) {
    return this.request('/api/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/api/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request(`/api/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses methods
  async getExpenses() {
    return this.request('/api/expenses');
  }

  async createExpense(data: {
    name: string;
    amount: number;
    category: string;
    store_id?: number;
    expense_date: string;
    receipt_url?: string;
    notes?: string;
  }) {
    console.log('API Service: Creating expense with data:', data);
    try {
      const result = await this.request('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('API Service: Expense created successfully:', result);
      return result;
    } catch (error) {
      console.error('API Service: Failed to create expense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, data: any) {
    return this.request(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string) {
    return this.request(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  async getExpenseStats() {
    return this.request('/api/expenses/stats/summary');
  }

  // Inventory methods
  async getProducts() {
    return this.request('/api/inventory');
  }

  async createProduct(data: {
    name: string;
    code: string;
    category: string;
    price: number;
    stock: number;
    description?: string;
    store_id?: number;
  }) {
    return this.request('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/api/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/inventory/${id}`, {
      method: 'DELETE',
    });
  }

  async updateStock(id: string, stock: number) {
    return this.request(`/api/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  }

  async getInventoryStats() {
    return this.request('/api/inventory/stats/summary');
  }

  // Payroll methods
  async getPayroll() {
    return this.request('/api/payroll');
  }

  async createPayroll(data: {
    employee_id: number;
    month: number;
    year: number;
    basic_salary: number;
    allowances?: number;
    deductions?: number;
    net_salary: number;
    status?: string;
  }) {
    return this.request('/api/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayroll(id: string, data: any) {
    return this.request(`/api/payroll/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePayroll(id: string) {
    return this.request(`/api/payroll/${id}`, {
      method: 'DELETE',
    });
  }

  async getPayrollStats() {
    return this.request('/api/payroll/stats/summary');
  }

  async getEmployeePayroll(employeeId: string) {
    return this.request(`/api/payroll/employee/${employeeId}`);
  }
}

export default new ApiService();