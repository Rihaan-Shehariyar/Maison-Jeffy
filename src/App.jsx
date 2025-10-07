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
        <Route path="/cart" element={<CartPage />} />
        <Route path="/chekout" element={<ChekoutPage />} /> 
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path='/payment'element = {<Payment />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />


        {/* admin page */}

         <Route path='/admin' element={<AdminLayout />} >
         <Route index element = {<AdminDashboard />} />

         <Route path='dashboard' element={<AdminDashboard />} />
         <Route path='admin-products' element={<AdminProducts />} />

            

      

        </Route> 

      </Routes>
    </>
  );
}

export default App;
