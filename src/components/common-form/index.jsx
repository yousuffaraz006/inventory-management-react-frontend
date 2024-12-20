// "use client";
// import { ContextComponent } from "@/context";
// import CommonButton from "../common-button";
// import LoadingIndicator from "../common-loader";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { useContext } from "react";
// import { Switch } from "../ui/switch";
// import { Textarea } from "../ui/textarea";

// function CommonForm({
//   formControls = [],
//   btnText,
//   handleSubmit,
//   buttonDisable,
//   labelDisable,
//   searchOptions,
// }) {
//   const {
//     loading,
//     formData,
//     companyName,
//     setCompanyName,
//     companyPhone,
//     setCompanyPhone,
//     companyEmail,
//     setCompanyEmail,
//     companyAddress,
//     setCompanyAddress,
//     firstName,
//     setFirstName,
//     lastName,
//     setLastName,
//     username,
//     setUsername,
//     password,
//     setPassword,
//     productName,
//     setProductName,
//     productRate,
//     setProductRate,
//     searchText,
//     setSearchText,
//     searchInputValue,
//     setSearchInputValue,
//     purchaseCost,
//     setPurchaseCost,
//     purchaseQuantity,
//     setPurchaseQuantity,
//     phoneNo,
//     setPhoneNo,
//     check,
//     setCheck,
//     customerName,
//     setCustomerName,
//     customerEmail,
//     setCustomerEmail,
//   } = useContext(ContextComponent);
//   const setValue = (label) => {
//     return label === "Company Name"
//       ? companyName
//       : label === "Company Contact No."
//       ? companyPhone
//       : label === "Company Email"
//       ? companyEmail
//       : label === "Company Address"
//       ? companyAddress
//       : label === "First Name"
//       ? firstName
//       : label === "Last Name"
//       ? lastName
//       : label === "Username" || label === "Email"
//       ? username
//       : label === "Password"
//       ? password
//       : label === "Product Name"
//       ? productName
//       : label === "Product Rate"
//       ? productRate
//       : label === "Search"
//       ? searchText
//       : label === "Search Product"
//       ? searchInputValue
//       : label === "Cost"
//       ? purchaseCost
//       : label === "Quantity"
//       ? purchaseQuantity
//       : label === "Phone No."
//       ? phoneNo
//       : label === "Customer Name"
//       ? customerName
//       : label === "Customer Email"
//       ? customerEmail
//       : label === "Verified"
//       ? check
//       : undefined;
//   };
//   const setState = (label, value) => {
//     label === "Company Name"
//       ? setCompanyName(value)
//       : label === "Company Contact No."
//       ? setCompanyPhone(value)
//       : label === "Company Email"
//       ? setCompanyEmail(value)
//       : label === "Company Address"
//       ? setCompanyAddress(value)
//       : label === "First Name"
//       ? setFirstName(value)
//       : label === "Last Name"
//       ? setLastName(value)
//       : label === "Username" || label === "Email"
//       ? setUsername(value)
//       : label === "Password"
//       ? setPassword(value)
//       : label === "Product Name"
//       ? setProductName(value)
//       : label === "Product Rate"
//       ? setProductRate(value)
//       : label === "Search"
//       ? setSearchText(value)
//       : label === "Search Product"
//       ? setSearchInputValue(value)
//       : label === "Cost"
//       ? setPurchaseCost(value)
//       : label === "Quantity"
//       ? setPurchaseQuantity(value)
//       : label === "Phone No."
//       ? setPhoneNo(value)
//       : label === "Customer Name"
//       ? setCustomerName(value)
//       : label === "Customer Email"
//       ? setCustomerEmail(value)
//       : label === "Verified"
//       ? setCheck(value)
//       : undefined;
//   };
//   const inputStyles =
//     "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
//   return (
//     <Form {...formData}>
//       <form onSubmit={handleSubmit}>
//         {formControls?.length > 0
//           ? formControls.map(
//               ({ id, label, componentType, placeholder, type, options }) => (
//                 <FormField
//                   control={formData.control}
//                   key={id}
//                   name={id}
//                   render={() => {
//                     return (
//                       <FormItem className={`mt-4${componentType === "checkbox" ? " flex justify-between items-center" : ""}`}>
//                         {labelDisable ? "" : <FormLabel>{label}</FormLabel>}
//                         {componentType === "input" ? (
//                           <FormControl>
//                             <Input
//                               placeholder={placeholder}
//                               type={type}
//                               value={setValue(label)}
//                               onChange={(e) => setState(label, e.target.value)}
//                               className={inputStyles}
//                               required
//                             />
//                           </FormControl>
//                         ) : componentType === "textarea" ? (
//                           <FormControl>
//                             <Textarea
//                               placeholder={placeholder}
//                               value={setValue(label)}
//                               onChange={(e) => setState(label, e.target.value)}
//                               className={inputStyles}
//                               required
//                             />
//                           </FormControl>
//                         ) : componentType === "checkbox" ? (
//                           <Switch
//                             checked={setValue(label)}
//                             onCheckedChange={() =>
//                               setState(label, !setValue(label))
//                             }
//                           />
//                         ) : null}
//                       </FormItem>
//                     );
//                   }}
//                 />
//               )
//             )
//           : null}
//         {loading && <LoadingIndicator />}
//         {buttonDisable ? (
//           ""
//         ) : (
//           <div className="flex mt-4 justify-center items-center">
//             <CommonButton type={"submit"} buttonText={btnText} />
//           </div>
//         )}
//       </form>
//     </Form>
//   );
// }

// export default CommonForm;

"use client";
import { useContext } from "react";
import { ContextComponent } from "@/context";
import CommonButton from "../common-button";
import LoadingIndicator from "../common-loader";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

function CommonForm({
  formControls = [],
  btnText,
  handleSubmit,
  buttonDisable,
  labelDisable,
}) {
  const {
    loading,
    companyName,
    setCompanyName,
    companyPhone,
    setCompanyPhone,
    companyEmail,
    setCompanyEmail,
    companyAddress,
    setCompanyAddress,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    password,
    setPassword,
    productName,
    setProductName,
    productRate,
    setProductRate,
    searchText,
    setSearchText,
    searchInputValue,
    setSearchInputValue,
    purchaseCost,
    setPurchaseCost,
    purchaseQuantity,
    setPurchaseQuantity,
    phoneNo,
    setPhoneNo,
    check,
    setCheck,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
  } = useContext(ContextComponent);

  const setValue = (label) => {
    return label === "Company Name"
      ? companyName
      : label === "Company Contact No."
      ? companyPhone
      : label === "Company Email"
      ? companyEmail
      : label === "Company Address"
      ? companyAddress
      : label === "First Name"
      ? firstName
      : label === "Last Name"
      ? lastName
      : label === "Username" || label === "Email"
      ? username
      : label === "Password"
      ? password
      : label === "Product Name"
      ? productName
      : label === "Product Rate"
      ? productRate
      : label === "Search"
      ? searchText
      : label === "Search Product"
      ? searchInputValue
      : label === "Cost"
      ? purchaseCost
      : label === "Quantity"
      ? purchaseQuantity
      : label === "Phone No."
      ? phoneNo
      : label === "Customer Name"
      ? customerName
      : label === "Customer Email"
      ? customerEmail
      : label === "Verified"
      ? check
      : undefined;
  };

  const setState = (label, value) => {
    label === "Company Name"
      ? setCompanyName(value)
      : label === "Company Contact No."
      ? setCompanyPhone(value)
      : label === "Company Email"
      ? setCompanyEmail(value)
      : label === "Company Address"
      ? setCompanyAddress(value)
      : label === "First Name"
      ? setFirstName(value)
      : label === "Last Name"
      ? setLastName(value)
      : label === "Username" || label === "Email"
      ? setUsername(value)
      : label === "Password"
      ? setPassword(value)
      : label === "Product Name"
      ? setProductName(value)
      : label === "Product Rate"
      ? setProductRate(value)
      : label === "Search"
      ? setSearchText(value)
      : label === "Search Product"
      ? setSearchInputValue(value)
      : label === "Cost"
      ? setPurchaseCost(value)
      : label === "Quantity"
      ? setPurchaseQuantity(value)
      : label === "Phone No."
      ? setPhoneNo(value)
      : label === "Customer Name"
      ? setCustomerName(value)
      : label === "Customer Email"
      ? setCustomerEmail(value)
      : label === "Verified"
      ? setCheck(value)
      : undefined;
  };

  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <form onSubmit={handleSubmit}>
      {formControls?.length > 0
        ? formControls.map(
            ({ id, label, componentType, placeholder, type }) => (
              <div key={id} className={`mt-4${componentType === "checkbox" ? " flex justify-between items-center" : ""}`}>
                {!labelDisable && <label>{label}</label>}
                {componentType === "input" ? (
                  <Input
                    placeholder={placeholder}
                    type={type}
                    defaultValue={setValue(label)}
                    onChange={(e) => setState(label, e.target.value)}
                    className={inputStyles}
                    required
                  />
                ) : componentType === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    defaultValue={setValue(label)}
                    onChange={(e) => setState(label, e.target.value)}
                    className={inputStyles}
                    required
                  />
                ) : componentType === "checkbox" ? (
                  <Switch
                    checked={setValue(label)}
                    onCheckedChange={() =>
                      setState(label, !setValue(label))
                    }
                  />
                ) : null}
              </div>
            )
          )
        : null}
      {loading && <LoadingIndicator />}
      {!buttonDisable && (
        <div className="flex mt-4 justify-center items-center">
          <CommonButton type="submit" buttonText={btnText} />
        </div>
      )}
    </form>
  );
}

export default CommonForm;
