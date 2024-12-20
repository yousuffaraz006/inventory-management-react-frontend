import api from "@/api";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  USER_NAME,
  USER_GROUP,
  COMPANY_NAME,
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [searchText, setSearchText] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [productName, setProductName] = useState("");
  const [productRate, setProductRate] = useState("");
  const [purchasesList, setPurchasesList] = useState([]);
  const [purchaseItemsList, setPurchaseItemsList] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
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
  const [employeesList, setEmployeesList] = useState([]);
  const [phoneNo, setPhoneNo] = useState("");
  const [check, setCheck] = useState(false);
  const [employee, setEmployee] = useState("");
  const { toast } = useToast();
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
    localStorage.setItem(USER_NAME, decoded.name);
    localStorage.setItem(USER_GROUP, decoded.groups);
    localStorage.setItem(COMPANY_NAME, decoded.company_name);
    setUser(decoded.username);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  const getCompany = async () => {
    await api
      .get("/company/")
      .then((res) => {
        localStorage.setItem("company_name", res.data.company_name);
        res.data.company_name === null ? "" : setCompanyName(res.data.company_name);
        setCompanyName(res.data.company_name);
        setCompanyPhone(res.data.company_phone);
        setCompanyEmail(res.data.company_email);
        setCompanyAddress(res.data.company_address);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getEmployees = async () => {
    await api
      .get("/")
      .then((res) => {
        setEmployeesList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProducts = async () => {
    await api
      .get("/products/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setProductsList(data);
      })
      .catch((err) => {
        console.log(err);
      });
    };
    const getPurchases = async () => {
    await api
      .get("/purchases/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setPurchasesList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCustomers = async () => {
    await api
      .get("/customers/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setCustomersList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getSales = async () => {
    await api
      .get("/sales/")
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setSalesList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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

  const resetStates = () => {
    setIsAuthorized(null);
    setLoading(false);
    setUser(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setCompanyName("");
    setSearchText("");
    setProductsList([]);
    setProductName("");
    setProductRate("");
    setPurchasesList([]);
    setPurchaseItemsList([]);
    setShowDialog(false);
    setCurrentUpdateId(null);
    setCurrentDeleteId(null);
    setSearchInputValue("");
    setShowDropdown(false);
    setFilteredOptions([]);
    setPurchaseCost("");
    setPurchaseQuantity("");
    setProductsSet([
      { productName: "", purchaseCost: "", purchaseQuantity: "" },
    ]);
    setEmployeesList([]);
    setPhoneNo("");
    setCheck(false);
    setEmployee("");
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
        firstName,
        setFirstName,
        lastName,
        setLastName,
        username,
        setUsername,
        password,
        setPassword,
        companyName,
        setCompanyName,
        companyPhone,
        setCompanyPhone,
        companyEmail,
        setCompanyEmail,
        companyAddress,
        setCompanyAddress,
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
        salesList,
        setSalesList,
        customersList,
        setCustomersList,
        customerName,
        setCustomerName,
        customerEmail,
        setCustomerEmail,
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
        employeesList,
        setEmployeesList,
        phoneNo,
        setPhoneNo,
        check,
        setCheck,
        employee,
        setEmployee,
        toast,
        navigate,
        formData,
        lastPart,
        auth,
        getCompany,
        getEmployees,
        getProducts,
        getPurchases,
        getCustomers,
        getSales,
        formatToIndianNumberSystem,
        resetStates,
      }}
    >
      {children}
    </ContextComponent.Provider>
  );
}

export default ProviderComponent;
