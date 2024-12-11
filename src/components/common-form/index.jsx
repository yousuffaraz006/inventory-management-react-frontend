import { ContextComponent } from "@/context";
import CommonButton from "../common-button";
import LoadingIndicator from "../common-loader";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useContext } from "react";

function CommonForm({
  formControls = [],
  btnText,
  handleSubmit,
  buttonDisable,
  labelDisable,
  searchOptions,
}) {
  const {
    loading,
    formData,
    companyName,
    setCompanyName,
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
    showDropdown,
    setShowDropdown,
    filteredOptions,
    setFilteredOptions,
    purchaseCost,
    setPurchaseCost,
    purchaseQuantity,
    setPurchaseQuantity,
  } = useContext(ContextComponent);
  const setValue = (label) => {
    return label === "Company Name"
      ? companyName
      : label === "Username"
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
      : null;
  };
  const setState = (label, value) => {
    label === "Company Name"
      ? setCompanyName(value)
      : label === "Username"
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
      : null;
  };
  const dropdownUpdate = (value) => {
    const filtered = searchOptions.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowDropdown(value !== "");
  };
  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
  return (
    <Form {...formData}>
      <form onSubmit={handleSubmit}>
        {formControls?.length > 0
          ? formControls.map(
              ({ id, label, componentType, placeholder, type, options }) => (
                <FormField
                  control={formData.control}
                  key={id}
                  name={id}
                  render={() => {
                    return (
                      <FormItem className="mt-4">
                        {labelDisable ? "" : <FormLabel>{label}</FormLabel>}
                        {componentType === "input" ? (
                          <FormControl>
                            <Input
                              placeholder={placeholder}
                              type={type}
                              value={setValue(label)}
                              onChange={(e) => setState(label, e.target.value)}
                              className={inputStyles}
                              required
                            />
                          </FormControl>
                        ) : componentType === "select" ? (
                          <Select
                            value={
                              options.find(
                                (optionItem) =>
                                  optionItem.label === setValue(label)
                              )?.id
                            }
                            onValueChange={(selectedId) => {
                              const selectedOption = options.find(
                                (optionItem) => optionItem.id === selectedId
                              );
                              if (selectedOption) {
                                setState(label, selectedOption.label);
                              }
                            }}
                            required
                          >
                            <FormControl>
                              <SelectTrigger className={inputStyles}>
                                <SelectValue
                                  placeholder={placeholder}
                                  className="text-black focus:text-black"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {options.map((optionItem) => (
                                <SelectItem
                                  value={optionItem.id}
                                  className="text-black cursor-pointer focus:text-black"
                                  key={optionItem.id}
                                >
                                  {optionItem.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : componentType === "searchInput" ? (
                          <>
                            <Input
                              type={type}
                              value={setValue(label)}
                              onChange={(e) => {
                                setState(label, e.target.value);
                                dropdownUpdate(e.target.value);
                              }}
                              placeholder={placeholder}
                              className={inputStyles}
                            />
                            {showDropdown && (
                              <ul className="absolute z-10 w-[90%] bg-white border border-gray-300 rounded-md shadow-lg">
                                {filteredOptions.length > 0 ? (
                                  filteredOptions.map((option, index) => (
                                    <li
                                      key={index}
                                      className="px-4 py-2 cursor-pointer hover:bg-blue-300"
                                      onClick={() => {
                                        setSearchInputValue(option);
                                        setShowDropdown(false);
                                      }}
                                    >
                                      {option}
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-4 py-2 cursor-pointer hover:bg-blue-300">
                                    No products found.
                                  </li>
                                )}
                              </ul>
                            )}
                          </>
                        ) : null}
                      </FormItem>
                    );
                  }}
                />
              )
            )
          : null}
        {loading && <LoadingIndicator />}
        {buttonDisable ? (
          ""
        ) : (
          <div className="flex mt-4 justify-center items-center">
            <CommonButton type={"submit"} buttonText={btnText} />
          </div>
        )}
      </form>
    </Form>
  );
}

export default CommonForm;
