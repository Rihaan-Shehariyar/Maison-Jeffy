import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import ViewProduct from './Pages/ViewProduct';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import CartPage from './Pages/CartPage';
import ChekoutPage from './Pages/ChekoutPage';
import WishlistPage from './Pages/WishlistPage';
import { WishlistProvider } from './context/WishlistContext';
import Payment from './Pages/Payment';
import PaymentSuccess from './Pages/PaymentSuccess';
import PaymentFailed from './Pages/PaymentFailed';
import OrdersPage from './Pages/OrdersPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import Products from './Pages/Products';
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard';
import AdminProducts from './Admin/AdminProducts';
import AdminOrders from './Admin/AdminOrders';
import AdminCustomers from './Admin/AdminCustomers';
import ProtectRouter from './Pages/ProtectRouter';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
   <AuthProvider>
  <CartProvider>
    <WishlistProvider>
      <OrderProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </OrderProvider>
    </WishlistProvider>
  </CartProvider>
</AuthProvider>



  );
}

function AppContent() {




  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register" ||
   location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/catalog' element={<Products />} />
        <Route path="/products/:id" element={<ViewProduct />} />
        <Route path="/cart" element={
          <ProtectRouter>
          <CartPage />
          </ProtectRouter>
          } />
        <Route path="/chekout" element={
           <ProtectRouter>
          <ChekoutPage />
          </ProtectRouter>
          } /> 
        <Route path="/wishlist" element={
          <ProtectRouter>
          <WishlistPage />
          </ProtectRouter>
          } />
        <Route path='/payment'element = {
          <ProtectRouter>
          <Payment />
          </ProtectRouter>
          } />
        <Route path="/payment-failed" element={
          <ProtectRouter>
          <PaymentFailed />
          </ProtectRouter>
          } />
        <Route path="/payment-success" element={
          <ProtectRouter>
          <PaymentSuccess />
          </ProtectRouter>
          } />
        <Route path="/orders" element={
          <ProtectRouter>
          <OrdersPage />
          </ProtectRouter>
          } />
        <Route path="/orders/:id" element={
          <ProtectRouter>
          <OrderDetailsPage />
          </ProtectRouter>
          } />


        {/* admin page */}

         <Route path='/admin' element={
          <ProtectRouter requiredRole="admin">
          <AdminLayout />
          </ProtectRouter>}
           >
         <Route index element = {<AdminDashboard />} /> 
         <Route path='dashboard' element={<AdminDashboard />} />
         <Route path='admin-products' element={<AdminProducts />} />
         <Route path = 'admin-orders' element = {<AdminOrders />} />
         <Route path='admin-customers' element = {<AdminCustomers />}/>
            

      

        </Route> 

      </Routes>

      <ToastContainer  position="top-right" autoClose={3000} theme="colored"/>

    </>
  );
}

export default App;
