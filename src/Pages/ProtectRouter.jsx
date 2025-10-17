import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectRouter({children,requiredRole}){

    const {user} = useAuth();


    if(!user){
        return <Navigate to ="/login" replace />
    }


    if(requiredRole && user.role !== requiredRole){


    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } 
    else {
      return <Navigate to="/home" replace />;
    }
    
    }

    return children

}