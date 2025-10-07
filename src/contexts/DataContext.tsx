import { createContext, useContext, useState, useEffect } from 'react';

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
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from JSON files on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Import JSON data files
      const [storesData, employeesData, productsData, salesData, expensesData, payrollData] = await Promise.all([
        import('../data/stores.json').then(module => module.default),
        import('../data/employees.json').then(module => module.default),
        import('../data/products.json').then(module => module.default),
        import('../data/sales.json').then(module => module.default),
        import('../data/expenses.json').then(module => module.default),
        import('../data/payroll.json').then(module => module.default)
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
      const newStore: Store = {
        id: Date.now().toString(),
        ...storeData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStores(prev => [...prev, newStore]);
      return newStore;
    } catch (error) {
      console.error('Failed to create store:', error);
      throw error;
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
    try {
      const newEmployee: Employee = {
        id: `EMP${Date.now()}`,
        avatar: employeeData.name.split(' ').map(n => n[0]).join(''),
        ...employeeData
      };
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error('Failed to create employee:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        id: `PROD${Date.now()}`,
        ...productData
      };
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  };

  const addSale = async (saleData: Omit<Sale, 'id' | 'billId'>) => {
    try {
      const newSale: Sale = {
        id: `SALE${Date.now()}`,
        billId: `BILL-${Date.now()}`,
        ...saleData
      };
      setSales(prev => [...prev, newSale]);
      return newSale;
    } catch (error) {
      console.error('Failed to create sale:', error);
      throw error;
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      const newExpense: Expense = {
        id: `EXP${Date.now()}`,
        ...expenseData
      };
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  };

  const addPayroll = async (payrollData: Omit<Payroll, 'id' | 'created_at'>) => {
    try {
      const newPayroll: Payroll = {
        id: `PAY${Date.now()}`,
        created_at: new Date().toISOString(),
        ...payrollData
      };
      setPayroll(prev => [...prev, newPayroll]);
      return newPayroll;
    } catch (error) {
      console.error('Failed to create payroll:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
    } catch (error) {
      console.error('Failed to update employee:', error);
      throw error;
    }
  };

  const updateStore = async (id: string, storeData: Partial<Store>) => {
    try {
      setStores(prev => prev.map(store => store.id === id ? { ...store, ...storeData } : store));
    } catch (error) {
      console.error('Failed to update store:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setProducts(prev => prev.map(product => product.id === id ? { ...product, ...productData } : product));
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      setExpenses(prev => prev.map(expense => expense.id === id ? { ...expense, ...expenseData } : expense));
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  };

  const updatePayroll = async (id: string, payrollData: Partial<Payroll>) => {
    try {
      setPayroll(prev => prev.map(payroll => payroll.id === id ? { ...payroll, ...payrollData } : payroll));
    } catch (error) {
      console.error('Failed to update payroll:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Failed to delete employee:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  };

  const deletePayroll = async (id: string) => {
    try {
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