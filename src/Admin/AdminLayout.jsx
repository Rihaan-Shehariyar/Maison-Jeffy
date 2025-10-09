import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function AdminLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
    { name: "Products", path: "/admin/admin-products", icon: <FaBoxOpen /> },
    { name: "Orders", path: "/admin/admin-orders", icon: <FaShoppingCart /> },
    { name: "Customers", path: "/admin/admin-customers", icon: <FaUsers /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white shadow-lg flex flex-col transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <h3 className={` relative top-2 text-lg font-bold tracking-wide transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}>
            Admin 
          </h3>
          <button onClick={() => setIsOpen(!isOpen)} className="text-xl text-gray-300 hover:text-yellow-300">
            <FaBars />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  isActive ? "bg-indigo-600 text-white font-semibold" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                style={{ textDecoration: "none" }}
              >
                <span className="text-lg text-white">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-700">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium" onClick={()=>navigate('/home')}>
            <FaSignOutAlt /> {isOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-6 overflow-y-auto h-screen transition-all duration-300"
        style={{ marginLeft: isOpen ? "16rem" : "5rem" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
