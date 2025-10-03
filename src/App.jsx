import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Registration from './components/Pages/Registration';
import Login from './components/Pages/Login';
import Home from './components/Pages/Home';
import ViewProduct from './components/Pages/ViewProduct';
import { CartProvider } from './components/Pages/CartContext';
import { OrderProvider } from './components/Pages/OrderContext';
import { AuthProvider } from './components/Pages/AuthContext';
import CartPage from './components/Pages/CartPage';
import ChekoutPage from './components/Pages/ChekoutPage';
import WishlistPage from './components/Pages/WishlistPage';
import { WishlistProvider } from './components/Pages/WishlistContext';
import Payment from './components/Pages/Payment';
import PaymentSuccess from './components/Pages/PaymentSuccess';
import PaymentFailed from './components/Pages/PaymentFailed';
import OrdersPage from './components/Pages/OrdersPage';
import OrderDetailsPage from './components/Pages/OrderDetailsPage';


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
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products/:id" element={<ViewProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/chekout" element={<ChekoutPage />} /> 
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path='/payment'element = {<Payment />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />

      </Routes>
    </>
  );
}

export default App;
