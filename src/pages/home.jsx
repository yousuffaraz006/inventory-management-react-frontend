"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { addCustomerFormControls, addEmployeeFormControls } from "@/config";
import { USER_GROUP } from "@/constants";
import { ContextComponent } from "@/context";
import { useContext, useEffect, useState } from "react";
import api from "@/api";
import CommonDialog from "@/components/common-dialog";
import Header from "@/components/common-header";
import EmployerView from "./employerView";
import EmployeeView from "./employeeView";

function HomePage() {
  const {
    setShowDialog,
    setLoading,
    loading,
    firstName,
    lastName,
    username,
    password,
    getEmployees,
    getCustomers,
    employeesList,
    setFirstName,
    setLastName,
    setUsername,
    setPassword,
    navigate,
    setCustomerName,
    customerName,
    setCustomerEmail,
    customerEmail,
    setPhoneNo,
    phoneNo,
    setShowDropdown,
    showDropdown,
    getProducts,
    productsList,
    customersList,
    formatToIndianNumberSystem,
  } = useContext(ContextComponent);

  useEffect(() => {
    if (localStorage.getItem(USER_GROUP) !== "employer") {
      getCustomers();
      getProducts();
    }
  }, []);
  const [productsSet, setProductsSet] = useState([
    { product: "", productPrice: "", productQuantity: "1" },
  ]);
  useEffect(() => {
    const total = productsSet.reduce((acc, product) => {
      const price = parseFloat(product.productPrice) || 0;
      const quantity = parseInt(product.productQuantity) || 0;
      return acc + price * quantity;
    }, 0);
    setTotalAmt(isNaN(total) ? "Calculating..." : total);
  }, [productsSet]);
  const productNames = productsList.map((product) => {
    return {
      id: product.id,
      name: product.product_name,
      price: product.product_rate,
    };
  });
  const [dropdownRow, setDropdownRow] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(productNames);
  const [totalAmt, setTotalAmt] = useState(0);
  const [open, setOpen] = useState(false);
  const [customerValue, setCustomerValue] = useState("");
  const updateDropdown = (value, index) => {
    const filtered = productNames.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) &&
        !addedProducts.includes(product.name)
    );
    setFilteredOptions(filtered);
    setDropdownRow(index);
  };
  const isAddButtonDisabled = () => {
    if (showDropdown) return true;
    if (allProductsSelected()) return true;
    const lastProduct = productsSet[productsSet.length - 1];
    return (
      Object.values(lastProduct).some((value) => value === "") ||
      lastProduct.purchaseCost === "0" ||
      lastProduct.purchaseQuantity === "0"
    );
  };
  const isSubmitButtonDisabled = () => {
    const lastProduct = productsSet[productsSet.length - 1];
    return (
      Object.values(lastProduct).some((value) => value === "") ||
      lastProduct.purchaseCost === "0" ||
      lastProduct.purchaseQuantity === "0"
    );
  };
  const handleProductChange = (index, field, value) => {
    let updatedProducts = [...productsSet];
    if (field === "product") {
      const selectedProduct = productNames.find(
        (p) => p.name.trim().toLowerCase() === value.trim().toLowerCase()
      );
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          product: selectedProduct.name,
          productPrice: selectedProduct.price,
        };
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          product: "",
          productPrice: "",
        };
      }
    } else if (
      field === "productPrice" &&
      (value === "0" || value.trim() === "")
    ) {
      value = "";
      updatedProducts[index] = {
        ...updatedProducts[index],
        productPrice: value,
      };
    } else if (
      field === "productQuantity" &&
      (!/^\d+$/.test(value) || value === "0")
    ) {
      value = "";
      updatedProducts[index] = {
        ...updatedProducts[index],
        productQuantity: value,
      };
    } else {
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    }
    setProductsSet(updatedProducts);
  };
  const handleAddProduct = () => {
    const selectedProducts = productsSet
      .map((product) => product.product)
      .filter((name) => name !== "");
    setAddedProducts(selectedProducts);
    const newProductsSet = [
      ...productsSet,
      { product: "", productPrice: "", productQuantity: "1" },
    ];
    setProductsSet(newProductsSet);
    setFilteredOptions(
      productNames.filter((option) => !selectedProducts.includes(option.name))
    );
  };
  const handleRemoveProduct = (index, e) => {
    e.preventDefault();
    if (productsSet.length <= 1) {
      setProductsSet([{ product: "", productPrice: "", productQuantity: "1" }]);
      return;
    }
    const updatedProducts = productsSet.filter((_, i) => i !== index);
    setProductsSet(updatedProducts);
  };
  const allProductsSelected = () => {
    const selectedProducts = productsSet
      .map((product) => product.product)
      .filter((name) => name !== "");
    const remainingProducts = productNames.filter(
      (option) => !selectedProducts.includes(option.name)
    );
    return remainingProducts.length === 0;
  };
  const options = filteredOptions == "" ? productNames : filteredOptions;
  const createEmployee = (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/", {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
      })
      .then(() => {
        getEmployees();
        setFirstName("");
        setLastName("");
        setUsername("");
        setPassword("");
        setShowDialog(false);
        setLoading(false);
      });
  };
  const createCustomer = (e) => {
    e.preventDefault();
    api
      .post("/customers/", {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: phoneNo,
      })
      .then(() => {
        getCustomers();
        setCustomerName("");
        setCustomerEmail(customerEmail);
        setPhoneNo(phoneNo);
        setShowDialog(false);
        setCustomerValue(customerEmail);
      });
  };
  const handleSubmit = (e) => {
    localStorage.getItem(USER_GROUP) === "employer"
      ? createEmployee(e)
      : createCustomer(e);
  };
  if (loading) {
    return (
      <Skeleton
        className={"w-full h-screen rounded-none bg-black opacity-70"}
      />
    );
  }

  return (
    <div className="px-5">
      {localStorage.getItem(USER_GROUP) === "employer" && <Header />}
      {localStorage.getItem(USER_GROUP) === "employer" ? (
        <EmployerView
          // employeesList={employeesList}
          navigate={navigate}
          setShowDialog={setShowDialog}
        />
      ) : (
        <EmployeeView
          customersList={customersList}
          dropdownRow={dropdownRow}
          formatToIndianNumberSystem={formatToIndianNumberSystem}
          handleAddProduct={handleAddProduct}
          handleProductChange={handleProductChange}
          handleRemoveProduct={handleRemoveProduct}
          isAddButtonDisabled={isAddButtonDisabled}
          isSubmitButtonDisabled={isSubmitButtonDisabled}
          navigate={navigate}
          open={open}
          options={options}
          productsList={productsList}
          productsSet={productsSet}
          setDropdownRow={setDropdownRow}
          setLoading={setLoading}
          setOpen={setOpen}
          setProductsSet={setProductsSet}
          setShowDialog={setShowDialog}
          setShowDropdown={setShowDropdown}
          setCustomerValue={setCustomerValue}
          showDropdown={showDropdown}
          totalAmt={totalAmt}
          updateDropdown={updateDropdown}
          customerValue={customerValue}
        />
      )}
      <CommonDialog
        title={
          localStorage.getItem(USER_GROUP) === "employer"
            ? "Add Employee"
            : "Add Customer"
        }
        formControls={
          localStorage.getItem(USER_GROUP) === "employer"
            ? addEmployeeFormControls
            : addCustomerFormControls
        }
        handleSubmit={handleSubmit}
        buttonText={"Add"}
      />
    </div>
  );
}

export default HomePage;
