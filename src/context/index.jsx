import api from "@/api";
import { ACCESS_TOKEN, FULL_NAME, REFRESH_TOKEN } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const ContextComponent = createContext(null);
function ProviderComponent({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const formData = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      password: "",
      fullname: "",
    },
  });
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    localStorage.setItem(FULL_NAME, decoded.fullname);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  return (
    <ContextComponent.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        loading,
        setLoading,
        firstname,
        setFirstname,
        lastname,
        setLastname,
        username,
        setUsername,
        password,
        setPassword,
        toast,
        navigate,
        formData,
        auth,
      }}
    >
      {children}
    </ContextComponent.Provider>
  );
}

export default ProviderComponent;
