import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import CommonLayout from "./components/common-layout";
import HomePage from "./pages/home";
import NotFound from "./pages/notFound";
import Products from "./pages/products";
import PurchasesHistory from "./pages/purchasesHistory";
import Profile from "./pages/profile";
import EmployeeDetail from "./pages/employeeDetail";
import SalesHistory from "./pages/salesHistory";
import CreateCompany from "./pages/companyPage";

function App() {
  function Logout() {
    localStorage.clear();
    return <Navigate to="/signin" />;
  }
  function GoToRegister() {
    return <SignUp />;
  }
  return (
    <Routes>
      <Route path="/signup" element={<GoToRegister />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/" element={<CommonLayout />}>
        <Route path="company" element={<CreateCompany />} />
        <Route path="" element={<HomePage />} />
        <Route path="employee/:pk" element={<EmployeeDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="products" element={<Products />} />
        <Route path="sales" element={<SalesHistory />} />
        <Route path="purchases" element={<PurchasesHistory />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
