import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

export default function AdminCustomers(){

    const[customers,SetCustomer] = useState([]);
    const[loading,setLoading] = useState(true);
    const[orders,setOrders]= useState([]);
    const[expanded,setExpanded]= useState(null)




    useEffect(()=>{
        fetchCustomers()
    },[])

    

    const fetchCustomers = async () =>{
        try{
    
            const[userRes,orderRes]  =  await Promise.all([
            axios .get("http://localhost:5000/users"),
            axios .get("http://localhost:5000/orders")
        ])
        const filteredUsers = userRes.data.filter((user) => user.role !== "admin");
        SetCustomer(filteredUsers)
        setOrders(orderRes.data)
        setLoading(false);
    }
    catch(err){
        console.error("Error in Loading Customeres",err)
    }
    }

    const deleteCustomers = async (id) =>{
        try{
            await axios.delete(`http://localhost:5000/users/${id}`)
            fetchCustomers()
        }
        catch(err){
            console.error("Error in Deleting",err)
        }
    }


    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id)
    }

     if (loading) return <p className="text-center mt-10 text-white">Loading customers...</p>;

    return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-cyan-400 text-center">
        Customers List
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full  rounded-lg flex-1 justify-center items-center ">
          <thead className="bg-[#1e293b] text-cyan-300">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((user, index) => {
                const userOrders = orders.filter((o) => o.userId === user.id);

                return (
                  <React.Fragment key={user.id}>
                    <tr className="border-b border-[#334155] hover:bg-[#334155]/30">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role || "user"}</td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => toggleExpand(user.id)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                          {expanded === user.id ? "Hide Orders" : "View Orders"}
                        </button> &nbsp; &nbsp;
                        <button
                          onClick={() => deleteCustomers(user.id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {expanded === user.id && (
                      <tr className="bg-[#1e293b]">
                        <td colSpan="5" className="p-4">
                          {userOrders.length > 0 ? (
                            <ul className="space-y-2">
                              {userOrders.map((order) => (
                                <li
                                  key={order.id}
                                  className="border border-[#334155] p-3 rounded-lg"
                                >
                                  <p>
                                    <span className="font-semibold">
                                      Order ID:
                                    </span>{" "}
                                    {order.id}
                                  </p>
                                  <p>
      
      
      
       <span className="font-semibold text-cyan-300">Items:</span>{" "}
      {order.products && order.products.length > 0 ? (
        order.products.map((p, i) => (
          <span key={i}>
            {p.name}
            {i < order.products.length - 1 ? ", " : ""}
          </span>
        ))
      ) : (
        <span className="text-gray-400">No items</span>
      )}
    </p>
                                  <p>
                                    <span className="font-semibold">Total:</span>{" "}
                                    ₹{order.total}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-400">
                              No orders for this user.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-400">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
