import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function AdminOrders(){

    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState(true);
    const [expanded,setExpanded] = useState(null);
    const [filter,setFilter] = useState("All");
    const [filteredOrders,setFilteredOrders] = useState([])

    useEffect (() => {
        fetchOrders()

    },[])

    const fetchOrders = async () => {

        try{
            const res = await axios.get("http://localhost:5000/orders");
            setOrders(res.data);
            setLoading(false);
        }
        catch(err){
            console.error("Error in Fetching",err)

        }
    }

      const statusChange = async (id,newStatus) => {
        try{
            await axios.patch(`http://localhost:5000/orders/${id}` , {status : newStatus})
            fetchOrders();
        }
        catch(err){
            console.error("Error in Updating",err)
        }

      }  

    const deleteOrder = async (id) => {
        if(!window.confirm("Delete This Order")) return;
        try{
            await axios.delete(`http://localhost:5000/orders/${id}`)
            fetchOrders();
        }
        catch(err){
            console.error("Error in deleting",err)
        }
    }

    const toggleExpand = (id) => { setExpanded(expanded === id ? null : id); };


    useEffect (()=>{
        if(filter == "All"){
            setFilteredOrders(orders);
        }
        else{
            setFilteredOrders(orders.filter((o)=> o.status === filter))
        }
    },[filter,orders])

    if (loading) return <p className="text-center text-white mt-10">Loading orders...</p>;


  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
        <br></br>
      <h1 className="text-2xl font-bold mb-6 text-center text-cyan-400">
        Manage Orders
      </h1>
      <br></br>

      {/* Filter Bar */}
      <div className="flex justify-center items-center mb-6 gap-3">
        <Filter size={18} className="text-cyan-300" />
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded-full transition font-medium ${
              filter === status
                ? "bg-cyan-600 text-white"
                : "bg-[#1e293b] hover:bg-[#334155] text-cyan-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <br></br>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[#1e293b] rounded-lg overflow-hidden">
          <thead className="bg-[#1e293b] text-cyan-300">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <br></br>

          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    onClick={() => toggleExpand(order.id)}
                    className="border-b border-[#1e293b] hover:bg-[#1e293b] transition cursor-pointer"
                  >
                    <td className="p-3 flex items-center gap-2 text-white">
                      {expanded === order.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                      {order.shipping?.name}
                    </td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3 text-cyan-400 font-semibold">₹{order.total}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          statusChange(order.id, e.target.value)
                        }
                        className="bg-[#1e293b] border border-[#334155] text-white rounded px-2 py-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option>Pending</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                   <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>

                    <td className="p-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteOrder(order.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {expanded === order.id && (
                    <tr className="bg-[#1e293b]/60 border-b border-[#1e293b] transition-all">
                      <td colSpan="6" className="p-4">
                        <h2 className="text-cyan-300 font-semibold mb-2">
                          Products in this Order:
                        </h2>
                        <table className="w-full text-sm border border-[#334155] rounded">
                          <thead className="bg-[#0f172a]/60 text-cyan-200">
                            <tr>
                              <th className="p-2 text-left">Product</th>
                              <th className="p-2 text-left">Qty</th>
                              <th className="p-2 text-left">Price</th>
                              <th className="p-2 text-left">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((p, i) => (
                              <tr
                                key={i}
                                className="border-b border-[#334155] hover:bg-[#0f172a]/70"
                              >
                                <td className="p-2">{p.name}</td>
                                <td className="p-2">{p.qty}</td>
                                <td className="p-2">₹{p.price}</td>
                                <td className="p-2 text-cyan-400">
                                  ₹{p.price * p.qty}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400 bg-[#1e293b]"
                >
                  No orders found for "{filter}" status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

