import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectRouter({children,requiredRole}){

    const {user} = useAuth;


    if(!user){
        return <Navigate to ="/login" replace />
    }


    if(requiredRole && user.role !== requiredRole){
        return  <Navigate to="/" replace />
    
    }

    return children

}