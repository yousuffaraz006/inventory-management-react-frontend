import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import CommonLayout from "./components/common-layout";
import HomePage from "./pages/home";
import NotFound from "./pages/notFound";
import Products from "./pages/products";
import SalesHistory from "./pages/salesHistory";
import PurchasesHistory from "./pages/purchasesHistory";
import Profile from "./pages/profile";

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
        <Route path="" element={<HomePage />} />
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
