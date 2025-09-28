import { createContext, useContext, useState } from 'react';

// Import JSON data
import storesData from '../data/stores.json';
import employeesData from '../data/employees.json';
import productsData from '../data/products.json';
import salesData from '../data/sales.json';
import expensesData from '../data/expenses.json';

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

interface DataContextType {
  stores: Store[];
  employees: Employee[];
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  addEmployee: (employee: Omit<Employee, 'id' | 'avatar'>) => void;
  addSale: (sale: Omit<Sale, 'id' | 'billId'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  updateStore: (id: string, store: Partial<Store>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteEmployee: (id: string) => void;
  deleteExpense: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>(storesData);
  const [employees, setEmployees] = useState<Employee[]>(employeesData);
  const [products, setProducts] = useState<Product[]>(productsData);
  const [sales, setSales] = useState<Sale[]>(salesData);
  const [expenses, setExpenses] = useState<Expense[]>(expensesData);

  const addStore = (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    const newStore: Store = {
      ...storeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStores(prev => [...prev, newStore]);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id' | 'avatar'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
      avatar: employeeData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'billId'>) => {
    const newSale: Sale = {
      ...saleData,
      id: `HGO${Math.floor(Math.random() * 1000)}`,
      billId: `BILL-${Date.now()}`,
    };
    setSales(prev => [...prev, newSale]);
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
  };

  const updateStore = (id: string, storeData: Partial<Store>) => {
    setStores(prev => prev.map(store => store.id === id ? { ...store, ...storeData } : store));
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => product.id === id ? { ...product, ...productData } : product));
  };

  const updateExpense = (id: string, expenseData: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => expense.id === id ? { ...expense, ...expenseData } : expense));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return (
    <DataContext.Provider value={{
      stores,
      employees,
      products,
      sales,
      expenses,
      addStore,
      addEmployee,
      addSale,
      addExpense,
      updateEmployee,
      updateStore,
      updateProduct,
      updateExpense,
      deleteEmployee,
      deleteExpense,
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