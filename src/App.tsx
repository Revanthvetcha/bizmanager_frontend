// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { DataProvider } from "./contexts/DataContext";
// import Layout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
// import Stores from "./pages/Stores";
// import Sales from "./pages/Sales";
// import Payroll from "./pages/Payroll";
// import Inventory from "./pages/Inventory";
// import Expenses from "./pages/Expenses";
// import Reports from "./pages/Reports";
// import Settings from "./pages/Settings";
// import { auth } from "./firebase"; 
// import { onAuthStateChanged } from "firebase/auth";
// import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user); 
//       setLoading(false); 
//     });
//     return () => unsubscribe(); 
//   }, []);

//   if (loading) {
//     return <div>Loading authentication...</div>;
//   }

//   return (
//     <ThemeProvider>
//       <DataProvider>
//         <Router>
//           <Routes>
//             {isAuthenticated ? (
//               <>
//                 <Route path="/" element={<Layout />}>
//                   <Route index element={<Dashboard />} />
//                   <Route path="stores" element={<Stores />} />
//                   <Route path="sales" element={<Sales />} />
//                   <Route path="payroll" element={<Payroll />} />
//                   <Route path="inventory" element={<Inventory />} />
//                   <Route path="expenses" element={<Expenses />} />
//                   <Route path="reports" element={<Reports />} />
//                   <Route path="settings" element={<Settings />} />
//                 </Route>
//                 <Route path="/sign-in" element={<SignIn />} />
//                 <Route path="/sign-up" element={<SignUp />} />
//               </>
//             ) : (
//               <>
//                 <Route path="/sign-in" element={<SignIn />} />
//                 <Route path="/sign-up" element={<SignUp />} />
//                 <Route path="*" element={<Navigate to="/sign-in" replace />} />
//               </>
//             )}
//           </Routes>
//         </Router>
//       </DataProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import Sales from "./pages/Sales";
import Payroll from "./pages/Payroll";
import Inventory from "./pages/Inventory";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { auth } from "./firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";
import SignIn from "./components/SignIn"; // We'll create this next
import SignUp from "./components/SignUp";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when the app starts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // True if user is logged in
      setLoading(false); // Stop loading once checked
    });
    return () => unsubscribe(); // Clean up when the app closes
  }, []);

  // Show loading screen while checking authentication
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          {isAuthenticated ? (
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="stores" element={<Stores />} />
                <Route path="sales" element={<Sales />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="*" element={<div>Please sign in to access the dashboard. <a href="/sign-in">Go to Sign In</a></div>} />
            </Routes>
          )}
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
