import api from "@/api";
import {
  ACCESS_TOKEN,
  COMPANY_NAME,
  REFRESH_TOKEN,
  USER_NAME,
} from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const ContextComponent = createContext(null);
function ProviderComponent({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [productName, setProductName] = useState("");
  const [productRate, setProductRate] = useState("");
  const [purchasesList, setPurchasesList] = useState([]);
  const [purchaseItemsList, setPurchaseItemsList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(null);
  const [currentDeleteId, setCurrentDeleteId] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [purchaseCost, setPurchaseCost] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState("");
  const [productsSet, setProductsSet] = useState([
    { productName: "", purchaseCost: "", purchaseQuantity: "" },
  ]);
  const { toast } = useToast();
  const { slug } = useParams();
  const navigate = useNavigate();
  const formData = useForm({
    defaultValues: {
      companyName: "",
      username: "",
      password: "",
    },
  });
  const location = useLocation();
  const fullPath = location.pathname;
  const lastPart = fullPath.substring(fullPath.lastIndexOf("/") + 1);
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
    localStorage.setItem(COMPANY_NAME, decoded.company_name);
    localStorage.setItem(USER_NAME, decoded.username);
    setUser(decoded.username);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  const getProducts = async () => {
    setLoading(true);
    await api
      .get("/products/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setProductsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getPurchases = async () => {
    setLoading(true);
    await api
      .get("/purchases/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setPurchasesList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const formatToIndianNumberSystem = (num) => {
    const numStr = num.toString();
    const [integerPart, decimalPart] = numStr.split(".");
    const lastThreeDigits = integerPart.slice(-3);
    const otherDigits = integerPart.slice(0, -3);
    const formattedIntegerPart =
      otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherDigits ? "," : "") +
      lastThreeDigits;
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  return (
    <ContextComponent.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        loading,
        setLoading,
        user,
        setUser,
        username,
        setUsername,
        password,
        setPassword,
        companyName,
        setCompanyName,
        searchText,
        setSearchText,
        productsList,
        setProductsList,
        productName,
        setProductName,
        productRate,
        setProductRate,
        purchasesList,
        setPurchasesList,
        purchaseItemsList,
        setPurchaseItemsList,
        showDialog,
        setShowDialog,
        currentUpdateId,
        setCurrentUpdateId,
        currentDeleteId,
        setCurrentDeleteId,
        searchInputValue,
        setSearchInputValue,
        showDropdown,
        setShowDropdown,
        filteredOptions,
        setFilteredOptions,
        purchaseCost,
        setPurchaseCost,
        purchaseQuantity,
        setPurchaseQuantity,
        productsSet,
        setProductsSet,
        toast,
        slug,
        navigate,
        formData,
        lastPart,
        auth,
        getProducts,
        getPurchases,
        formatToIndianNumberSystem,
      }}
    >
      {children}
    </ContextComponent.Provider>
  );
}

export default ProviderComponent;
