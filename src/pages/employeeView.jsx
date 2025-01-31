import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import CommonButton from "@/components/common-button";
import api from "@/api";
import { useContext, useState } from "react";
import { ContextComponent } from "@/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function EmployeeView({
  customersList,
  dropdownRow,
  formatToIndianNumberSystem,
  handleAddProduct,
  handleProductChange,
  handleRemoveProduct,
  isAddButtonDisabled,
  isSubmitButtonDisabled,
  navigate,
  open,
  options,
  productsList,
  productsSet,
  setDropdownRow,
  setLoading,
  setOpen,
  setProductsSet,
  setShowDialog,
  setShowDropdown,
  setCustomerValue,
  showDropdown,
  totalAmt,
  updateDropdown,
  customerValue,
}) {
  const {
    companyName,
    companyPhone,
    companyEmail,
    companyAddress,
    toast,
    setCustomerEmail,
    customerEmail,
    setPhoneNo,
    phoneNo,
    mode,
    setMode,
  } = useContext(ContextComponent);
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  const formattedDate = `${day}, ${month} ${year}`;
  const getProductIdByName = (name) => {
    const product = productsList.find((item) => item.product_name === name);
    return product ? product.id : null;
  };
  const getCustomerIdByName = (email) => {
    const customer = customersList.find((c) => c.customer_email === email);
    return customer ? customer.id : null;
  };
  const createSale = async (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/sales/", {
        sale_customer: getCustomerIdByName(customerValue),
        sale_total: totalAmt,
        items: productsSet?.map((product) => ({
          s_item_product: getProductIdByName(product.product),
          s_item_price: product.productPrice,
          s_item_quantity: product.productQuantity,
        })),
      })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Sale placed successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: "Sale not created : " + res.status,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "" + err,
        });
        setLoading(false);
      });
  };
  const createPurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/purchases/", {
        items: productsSet?.map((product) => ({
          p_item_product: getProductIdByName(product.product),
          p_item_cost: product.productPrice,
          p_item_quantity: product.productQuantity,
        })),
        purchase_total: totalAmt,
      })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Purchase placed successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: "Purchase not created : " + res.status,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "" + err,
        });
        setLoading(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "Sale") {
      createSale(e);
    } else if (mode === "Purchase") {
      createPurchase(e);
    }
  };
  return (
    <div className="my-5">
      <Tabs defaultValue="sale" className="my-3">
        <TabsList className="w-full h-auto bg-black text-white">
          <TabsTrigger
            value="sale"
            onClick={() => {
              setMode("Sale");
              setProductsSet([
                { product: "", productPrice: "", productQuantity: "1" },
              ]);
            }}
            className={`mx-2 text-2xl hover:bg-white hover:text-black ${
              mode === "Sale" ? "bg-white text-black" : ""
            }`}
          >
            Sale
          </TabsTrigger>
          <TabsTrigger
            value="purchase"
            onClick={() => {
              setMode("Purchase");
              setProductsSet([
                { product: "", productPrice: "", productQuantity: "1" },
              ]);
            }}
            className={`mx-2 text-2xl hover:bg-white hover:text-black ${
              mode === "Purchase" ? "bg-white text-black" : ""
            }`}
          >
            Purchase
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sale">
          <div className="flex justify-between items-start mb-6">
            <div className="text-6xl font-serif font-bold"></div>
            <div className="text-right">
              <h2 className="text-3xl font-serif font-bold tracking-widest">
                INVOICE
              </h2>
              <p>{formattedDate}</p>
            </div>
          </div>
          <div className="flex justify-between items-start mb-5">
            <div>
              <h1 className="text-2xl font-bold text-red-500">{companyName}</h1>
              <p className="text-gray-600">{companyAddress.split(",")[0]}</p>
              <p className="text-gray-600">{companyAddress.split(",")[1]}</p>
              <p className="text-gray-600">{companyAddress.split(",")[2]}</p>
              <p className="text-black">+91 {companyPhone}</p>
              <p className="text-black">{companyEmail}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">Billed To:</p>
              <div className="flex justify-end">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {customerValue
                        ? customersList.find(
                            (customer) =>
                              customer.customer_email === customerValue
                          )?.customer_name
                        : "Select customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search customers..."
                        onValueChange={(e) => {
                          setCustomerEmail(e);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customersList.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.customer_email}
                              onSelect={(currentValue) => {
                                setCustomerValue(
                                  currentValue === customerValue
                                    ? ""
                                    : currentValue
                                );
                                setCustomerEmail(customer.customer_email);
                                setPhoneNo(customer.customer_phone);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customerValue === customer.customer_email
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.customer_email}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <CommonButton
                  extraStyles="text-2xl pb-3 h-10 w-10"
                  buttonText={"+"}
                  onClick={() => setShowDialog(true)}
                />
              </div>
              {customerValue && (
                <>
                  <p className="text-gray-600 mt-2">{phoneNo}</p>
                  <p className="text-gray-600">{customerEmail}</p>
                  <div className="rat"></div>
                </>
              )}
            </div>
          </div>
          {customerValue && (
            <form onSubmit={handleSubmit}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow
                    className="grid grid-cols-6 gap-4 border-b pb-2"
                    style={{
                      gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr 1fr",
                    }}
                  >
                    <TableHead>S.No</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsSet.map((product, index) => (
                    <TableRow
                      key={index}
                      className="grid grid-cols-6 gap-4 hover:bg-gray-100"
                      style={{
                        gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr 1fr",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Popover
                          open={dropdownRow === index && showDropdown}
                          onOpenChange={(isOpen) => {
                            setShowDropdown(isOpen);
                            setDropdownRow(isOpen ? index : null);
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {product.product && product.product.length > 40
                                ? `${product.product.slice(0, 40)}...`
                                : product.product || "Select product..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search products..."
                                onValueChange={(value) =>
                                  updateDropdown(value, index)
                                }
                              />
                              <CommandList>
                                <CommandEmpty>No products found.</CommandEmpty>
                                {options.map((option) => (
                                  <CommandItem
                                    key={option.id}
                                    onSelect={() => {
                                      handleProductChange(
                                        index,
                                        "product",
                                        option.name
                                      );
                                      setShowDropdown(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        product.product === option.name
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {option.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.productQuantity || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "productQuantity",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={product.productPrice || ""}
                          onChange={(e) =>
                            handleProductChange(
                              index,
                              "productPrice",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {formatToIndianNumberSystem(
                          product.productPrice * product.productQuantity
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <CommonButton
                            onClick={(e) => handleRemoveProduct(index, e)}
                            buttonText={"Remove"}
                            extraStyles={
                              "bg-red-500 text-white hover:bg-red-700 hover:text-white border-none px-2 py-1 text-xs h-[30px]"
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-between">
                <CommonButton
                  type="button"
                  onClick={handleAddProduct}
                  buttonText="Add Product"
                  disabled={isAddButtonDisabled()}
                />
                <div className="font-bold text-2xl">
                  Total: ₹{formatToIndianNumberSystem(totalAmt)}
                </div>
              </div>
              <div className="mt-4">
                <CommonButton
                  type="submit"
                  buttonText={"Save"}
                  disabled={isSubmitButtonDisabled()}
                  extraStyles="w-full"
                />
              </div>
            </form>
          )}
        </TabsContent>
        <TabsContent value="purchase">
          <form onSubmit={handleSubmit}>
            <Table className="w-full">
              <TableHeader>
                <TableRow
                  className="grid grid-cols-6 gap-4 border-b pb-2"
                  style={{
                    gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr 1fr",
                  }}
                >
                  <TableHead>S.No</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsSet.map((product, index) => (
                  <TableRow
                    key={index}
                    className="grid grid-cols-6 gap-4 hover:bg-gray-100"
                    style={{
                      gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr 1fr",
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Popover
                        open={dropdownRow === index && showDropdown}
                        onOpenChange={(isOpen) => {
                          setShowDropdown(isOpen);
                          setDropdownRow(isOpen ? index : null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {product.product && product.product.length > 40
                              ? `${product.product.slice(0, 40)}...`
                              : product.product || "Select product..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search products..."
                              onValueChange={(value) =>
                                updateDropdown(value, index)
                              }
                            />
                            <CommandList>
                              <CommandEmpty>No products found.</CommandEmpty>
                              {options.map((option) => (
                                <CommandItem
                                  key={option.id}
                                  onSelect={() => {
                                    handleProductChange(
                                      index,
                                      "product",
                                      option.name
                                    );
                                    setShowDropdown(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      product.product === option.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.productQuantity || ""}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "productQuantity",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={product.productPrice || ""}
                        onChange={(e) =>
                          handleProductChange(
                            index,
                            "productPrice",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {formatToIndianNumberSystem(
                        product.productPrice * product.productQuantity
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <CommonButton
                          onClick={(e) => handleRemoveProduct(index, e)}
                          buttonText={"Remove"}
                          extraStyles={
                            "bg-red-500 text-white hover:bg-red-700 hover:text-white border-none px-2 py-1 text-xs h-[30px]"
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
              <CommonButton
                type="button"
                onClick={handleAddProduct}
                buttonText="Add Product"
                disabled={isAddButtonDisabled()}
              />
              <div className="font-bold text-2xl">
                Total: ₹{formatToIndianNumberSystem(totalAmt)}
              </div>
            </div>
            <div className="mt-4">
              <CommonButton
                type="submit"
                buttonText={"Save"}
                disabled={isSubmitButtonDisabled()}
                extraStyles="w-full"
              />
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EmployeeView;
