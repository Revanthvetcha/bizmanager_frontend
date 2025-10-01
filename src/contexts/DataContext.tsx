import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  gstin: string;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  salary: number;
  status: string;
  avatar: string;
  joinDate: string;
  location?: string;
  address?: string;
  allowances?: number;
  store_id?: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

interface Sale {
  id: string;
  customer: string;
  store: string;
  amount: number;
  status: string;
  date: string;
  phone: string;
  location: string;
  items: number;
  paymentMethod: string;
  advance: number;
  balance: number;
  billId: string;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  store: string;
  date: string;
  receiptUrl: string;
  notes: string;
}

interface Payroll {
  id: string;
  employee_id: number;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: string;
  payment_date?: string;
  created_at: string;
}

interface DataContextType {
  stores: Store[];
  employees: Employee[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  payroll: Payroll[];
  loading: boolean;
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => Promise<Store>;
  addEmployee: (employee: Omit<Employee, 'id' | 'avatar'>) => Promise<Employee>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  addSale: (sale: Omit<Sale, 'id' | 'billId'>) => Promise<Sale>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<Expense>;
  addPayroll: (payroll: Omit<Payroll, 'id' | 'created_at'>) => Promise<Payroll>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  updateStore: (id: string, store: Partial<Store>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  updatePayroll: (id: string, payroll: Partial<Payroll>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deletePayroll: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from API when user is authenticated
  useEffect(() => {
    if (token && user) {
      loadData();
    } else {
      // Clear data when user is not authenticated
      setStores([]);
      setEmployees([]);
      setProducts([]);
      setSales([]);
      setExpenses([]);
      setPayroll([]);
      setLoading(false);
    }
  }, [token, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [storesData, employeesData, productsData, salesData, expensesData, payrollData] = await Promise.all([
        apiService.getStores().catch((error) => {
          console.error('Failed to load stores:', error);
          return [];
        }),
        apiService.getEmployees().catch((error) => {
          console.error('Failed to load employees:', error);
          return [];
        }),
        apiService.getProducts().catch((error) => {
          console.error('Failed to load products:', error);
          return [];
        }),
        apiService.getSales().catch((error) => {
          console.error('Failed to load sales:', error);
          return [];
        }),
        apiService.getExpenses().catch((error) => {
          console.error('Failed to load expenses:', error);
          return [];
        }),
        apiService.getPayroll().catch((error) => {
          console.error('Failed to load payroll:', error);
          return [];
        })
      ]);

      setStores(Array.isArray(storesData) ? storesData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
      setExpenses(Array.isArray(expensesData) ? expensesData : []);
      setPayroll(Array.isArray(payrollData) ? payrollData : []);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Set empty arrays as fallback
      setStores([]);
      setEmployees([]);
      setProducts([]);
      setSales([]);
      setExpenses([]);
      setPayroll([]);
    } finally {
      setLoading(false);
    }
  };

  const addStore = async (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    try {
      const newStore = await apiService.createStore({
        name: storeData.name,
        address: storeData.address,
        phone: storeData.phone,
        gstin: storeData.gstin,
      });
      setStores(prev => [...prev, newStore]);
      return newStore;
    } catch (error) {
      console.error('Failed to create store:', error);
      throw error;
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
    try {
      const newEmployee = await apiService.createEmployee({
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        position: employeeData.position,
        salary: employeeData.salary,
        hire_date: employeeData.joinDate,
        status: employeeData.status,
        store_id: employeeData.store_id ? parseInt(employeeData.store_id) : undefined,
        department: employeeData.department,
        address: employeeData.address,
        allowances: employeeData.allowances,
      });
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await apiService.createProduct({
        name: productData.name,
        code: productData.code,
        category: productData.category,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
      });
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'billId'>) => {
    try {
      console.log('DataContext: Creating sale with data:', saleData);
      const newSale = await apiService.createSale({
        customer: saleData.customer,
        phone: saleData.phone,
        location: saleData.location,
        store: saleData.store,
        amount: saleData.amount,
        items: saleData.items,
        paymentMethod: saleData.paymentMethod,
        advance: saleData.advance,
        status: saleData.status,
      });
      console.log('DataContext: Sale created successfully:', newSale);
      setSales(prev => [...prev, newSale]);
      return newSale;
    } catch (error) {
      console.error('DataContext: Failed to create sale:', error);
      throw error;
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      // Find the store ID from the store name
      const store = stores.find(s => s.name === expenseData.store);
      const storeId = store ? parseInt(store.id) : undefined;
      
      console.log('DataContext: Creating expense with data:', expenseData);
      console.log('DataContext: Found store:', store, 'Store ID:', storeId);
      
      const newExpense = await apiService.createExpense({
        name: expenseData.name,
        amount: expenseData.amount,
        category: expenseData.category,
        store_id: storeId,
        expense_date: expenseData.date,
        receipt_url: expenseData.receiptUrl,
        notes: expenseData.notes,
      });
      console.log('DataContext: Expense created successfully:', newExpense);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (error) {
      console.error('DataContext: Failed to create expense:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      await apiService.updateEmployee(id, employeeData);
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  const updateStore = async (id: string, storeData: Partial<Store>) => {
    try {
      await apiService.updateStore(id, storeData);
      setStores(prev => prev.map(store => store.id === id ? { ...store, ...storeData } : store));
    } catch (error) {
      console.error('Failed to update store:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await apiService.updateProduct(id, productData);
      setProducts(prev => prev.map(product => product.id === id ? { ...product, ...productData } : product));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      // Find the store ID from the store name if store is being updated
      let storeId = undefined;
      if (expenseData.store) {
        const store = stores.find(s => s.name === expenseData.store);
        storeId = store ? parseInt(store.id) : undefined;
      }
      
      const updateData = {
        ...expenseData,
        store_id: storeId
      };
      
      // Remove the store field since we're sending store_id instead
      delete updateData.store;
      
      await apiService.updateExpense(id, updateData);
      setExpenses(prev => prev.map(expense => expense.id === id ? { ...expense, ...expenseData } : expense));
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await apiService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  const addPayroll = async (payrollData: Omit<Payroll, 'id' | 'created_at'>) => {
    try {
      const newPayroll = await apiService.createPayroll({
        employee_id: payrollData.employee_id,
        month: payrollData.month,
        year: payrollData.year,
        basic_salary: payrollData.basic_salary,
        allowances: payrollData.allowances,
        deductions: payrollData.deductions,
        net_salary: payrollData.net_salary,
        status: payrollData.status,
      });
      setPayroll(prev => [...prev, newPayroll]);
      return newPayroll;
    } catch (error) {
      console.error('Failed to create payroll:', error);
      throw error;
    }
  };

  const updatePayroll = async (id: string, payrollData: Partial<Payroll>) => {
    try {
      await apiService.updatePayroll(id, payrollData);
      setPayroll(prev => prev.map(payroll => payroll.id === id ? { ...payroll, ...payrollData } : payroll));
    } catch (error) {
      console.error('Failed to update payroll:', error);
      throw error;
    }
  };

  const deletePayroll = async (id: string) => {
    try {
      await apiService.deletePayroll(id);
      setPayroll(prev => prev.filter(payroll => payroll.id !== id));
    } catch (error) {
      console.error('Failed to delete payroll:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      stores,
      employees,
      products,
      sales,
      expenses,
      payroll,
      loading,
      addStore,
      addEmployee,
      addProduct,
      addSale,
      addExpense,
      addPayroll,
      updateEmployee,
      updateStore,
      updateProduct,
      updateExpense,
      updatePayroll,
      deleteEmployee,
      deleteExpense,
      deletePayroll,
      refreshData: loadData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}