import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PointsRetraitPage from './pages/PointsRetraitPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAvisPage from './pages/admin/AdminAvisPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminStocksPage from './pages/admin/AdminStocksPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

const ProductDetailWrapper = () => {
  const { id } = useParams();
  return <ProductDetailPage key={id} />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Routes publiques avec Layout principal */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="product/:id" element={<ProductDetailWrapper />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="points-retrait" element={<PointsRetraitPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="order-confirmation" element={<OrderConfirmationPage />} />

                {/* Routes protégées (utilisateurs connectés) */}
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Routes Admin avec Layout Admin séparé */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="avis" element={<AdminAvisPage />} />
                <Route path="utilisateurs" element={<AdminUsersPage />} />
                <Route path="commandes" element={<AdminOrdersPage />} />
                <Route path="produits" element={<AdminProductsPage />} />
                <Route path="stocks" element={<AdminStocksPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;