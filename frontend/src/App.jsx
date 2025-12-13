import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TableProvider } from './contexts/TableContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminHeader from './components/AdminHeader';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import RoleSelection from './pages/RoleSelection';
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import TableManagement from './pages/admin/TableManagement';
import './App.css';

// Layout component for user routes with Header and Footer
const Layout = ({ children }) => (
  <>
    <Header />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

// Admin Layout - Only Admin Header, no Footer
const AdminLayout = ({ children }) => (
  <>
    <AdminHeader />
    <main className="main-content" style={{ minHeight: 'calc(100vh - 80px)' }}>
      {children}
    </main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <TableProvider>
      <Router>
        <div className="app">
            <Routes>
            {/* Role Selection - No Header/Footer */}
            <Route path="/" element={<RoleSelection />} />
            
            {/* Admin Login - No Header/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
              
            {/* User Routes - No login required, 4 main pages */}
              <Route 
              path="/home" 
                element={
                <Layout>
                  <Home />
                </Layout>
                } 
              />
              <Route 
              path="/menu" 
                element={
                <Layout>
                  <Menu />
                </Layout>
                } 
              />
              <Route 
              path="/cart" 
                element={
                <Layout>
                  <Cart />
                </Layout>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                <Layout>
                    <Checkout />
                </Layout>
              } 
            />
            <Route 
              path="/payment" 
              element={
                <Layout>
                  <Payment />
                </Layout>
                } 
              />
            <Route 
              path="/payment/success" 
              element={
                <Layout>
                  <PaymentSuccess />
                </Layout>
                } 
              />
            <Route 
              path="/payment/failed" 
              element={
                <Layout>
                  <PaymentFailed />
                </Layout>
                } 
              />
              
            {/* Protected Admin Routes - Admin Layout Only */}
              <Route 
                path="/admin/dashboard" 
                element={
                <AdminLayout>
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                </AdminLayout>
                } 
              />
              <Route 
                path="/admin/menu" 
                element={
                <AdminLayout>
                  <ProtectedRoute requireAdmin={true}>
                    <MenuManagement />
                  </ProtectedRoute>
                </AdminLayout>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                <AdminLayout>
                  <ProtectedRoute requireAdmin={true}>
                    <OrderManagement />
                  </ProtectedRoute>
                </AdminLayout>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                <AdminLayout>
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                  </ProtectedRoute>
                </AdminLayout>
              } 
            />
            <Route 
              path="/admin/tables" 
              element={
                <AdminLayout>
                  <ProtectedRoute requireAdmin={true}>
                    <TableManagement />
                  </ProtectedRoute>
                </AdminLayout>
                } 
              />
            </Routes>
        </div>
      </Router>
      </TableProvider>
    </AuthProvider>
  );
}

export default App;