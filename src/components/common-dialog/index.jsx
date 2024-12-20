import { useContext, useEffect, useState } from "react";
import CommonForm from "../common-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { ContextComponent } from "@/context";
import { Input } from "../ui/input";
import CommonButton from "../common-button";
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
("use client");

function CommonDialog({
  title,
  formControls,
  handleSubmit,
  buttonText,
  searchOptions,
}) {
  const {
    showDialog,
    setShowDialog,
    currentDeleteId,
    setCurrentDeleteId,
    setCurrentUpdateId,
    setProductName,
    setProductRate,
    lastPart,
    productsSet,
    setProductsSet,
    showDropdown,
    setShowDropdown,
    toast,
    setFirstName,
    setLastName,
    setUsername,
    setPassword,
    setPhoneNo,
    formatToIndianNumberSystem,
  } = useContext(ContextComponent);
  const [dropdownRow, setDropdownRow] = useState(null);
  const [activeRow, setActiveRow] = useState(0);
  const [addedProducts, setAddedProducts] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(searchOptions);
  const [totalAmt, setTotalAmt] = useState(0);

  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg";

  const resetDialogState = () => {
    setProductsSet([
      { productName: "", purchaseCost: "", purchaseQuantity: "" },
    ]);
    setShowDialog(false);
    setCurrentDeleteId(null);
    setCurrentUpdateId(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setProductName("");
    setProductRate("");
    setActiveRow(0);
    setAddedProducts([]);
    setDropdownRow(null);
    setTotalAmt(0);
    setPhoneNo("");
  };

  useEffect(() => {
    productsSet.map((product) => {
      const productName = product.productName;
      const productRate = product.purchaseCost;
      const purchaseQuantity = product.purchaseQuantity;
      if (productName && productRate && purchaseQuantity) {
        setTotalAmt(
          isNaN(
            productsSet.reduce(
              (acc, product) =>
                acc +
                parseFloat(product.purchaseCost) *
                  parseFloat(product.purchaseQuantity),
              0
            )
          )
            ? "Calculating..."
            : productsSet.reduce(
                (acc, product) =>
                  acc +
                  parseFloat(product.purchaseCost) *
                    parseFloat(product.purchaseQuantity),
                0
              )
        );
      }
    });
  }, [productsSet]);

  const handleAddProduct = () => {
    const selectedProducts = productsSet
      .map((product) => product.productName)
      .filter((name) => name.trim() !== "");
    setAddedProducts(selectedProducts);
    const allProductsSelected =
      searchOptions.filter((option) => !selectedProducts.includes(option.name))
        .length === 0;
    if (allProductsSelected) {
      toast({ title: "All products are selected. No new row will be added." });
      return;
    }
    const newProductsSet = [
      ...productsSet,
      { productName: "", purchaseCost: "", purchaseQuantity: "" },
    ];
    setProductsSet(newProductsSet);
    setActiveRow(newProductsSet.length - 1);
    setFilteredOptions(
      searchOptions.filter((option) => !selectedProducts.includes(option.name))
    );
  };

  const allProductsSelected = () => {
    const selectedProducts = productsSet
      .map((product) => product.productName)
      .filter((name) => name.trim() !== "");
    const remainingProducts = searchOptions.filter(
      (option) => !selectedProducts.includes(option.name)
    );
    return remainingProducts.length === 0;
  };

  const isAddButtonDisabled = () => {
    if (showDropdown) return true;
    if (allProductsSelected()) return true;
    const lastProduct = productsSet[productsSet.length - 1];
    return (
      Object.values(lastProduct).some((value) => value.trim() === "") ||
      lastProduct.purchaseCost === "0" ||
      lastProduct.purchaseQuantity === "0"
    );
  };

  const isSubmitButtonDisabled = () => {
    const lastProduct = productsSet[productsSet.length - 1];
    return (
      Object.values(lastProduct).some((value) => value.trim() === "") ||
      lastProduct.purchaseCost === "0" ||
      lastProduct.purchaseQuantity === "0"
    );
  };

  const handleProductChange = (index, field, value) => {
    if (field === "purchaseCost" && (value === "0" || value.trim() === "")) {
      // Prevent purchase cost from being 0 or empty
      value = "";
    } else if (
      field === "purchaseQuantity" &&
      (!/^\d+$/.test(value) || value === "0")
    ) {
      // Prevent purchase quantity from being a float or 0
      value = "";
    }
    const updatedProducts = productsSet.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProductsSet(updatedProducts);
  };

  const updateDropdown = (value, index) => {
    if (index === activeRow) {
      const filtered = searchOptions.filter(
        (option) =>
          option.name.toLowerCase().includes(value.toLowerCase()) &&
          !addedProducts.includes(option.name)
      );
      setFilteredOptions(filtered);
      setDropdownRow(index);
    }
  };

  const options = filteredOptions == "" ? searchOptions : filteredOptions;

  const total = isNaN(totalAmt)
    ? totalAmt
    : formatToIndianNumberSystem(totalAmt);

  return (
    <Dialog
      open={showDialog}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setFilteredOptions(searchOptions);
        }
        resetDialogState(isOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {currentDeleteId && (
            <b className="text-black text-lg">
              This action is irreversible. Are you sure you want to delete this
              item?
            </b>
          )}
        </DialogDescription>
        {lastPart === "purchases" ? (
          <form onSubmit={handleSubmit}>
            {productsSet.map((product, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-2xl mb-3">Product {index + 1}</h4>
                {formControls.map(
                  ({ id, label, placeholder, type, componentType }) => (
                    <div key={id} className="mb-2">
                      <label className="block text-sm font-medium mb-1">
                        {label}
                      </label>
                      {componentType === "searchInput" ? (
                        <Popover
                          open={dropdownRow === index && showDropdown}
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setShowDropdown(true);
                              setDropdownRow(index);
                            } else {
                              setShowDropdown(false);
                              setDropdownRow(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={showDropdown}
                              className="w-full justify-between"
                              disabled={index !== activeRow}
                            >
                              {product[id] ? product[id] : "Select products..."}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          {showDropdown ||
                          index === activeRow ||
                          dropdownRow === index ? (
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search products..."
                                  className="h-9"
                                  onValueChange={(value) =>
                                    updateDropdown(value, index)
                                  }
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No products found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {options.map((option) => (
                                      <CommandItem
                                        key={option.id}
                                        value={option.name}
                                        onSelect={(selectedOption) => {
                                          handleProductChange(
                                            index,
                                            id,
                                            selectedOption
                                          );
                                          setShowDropdown(false);
                                          setDropdownRow(null);
                                        }}
                                        disabled={
                                          productsSet[index][id] === option.name
                                        }
                                      >
                                        {option.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            productsSet[index][id] ===
                                              option.name
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          ) : null}
                        </Popover>
                      ) : (
                        <Input
                          type={type}
                          placeholder={placeholder}
                          value={product[id] == 0 ? "" : product[id]}
                          onChange={(e) =>
                            handleProductChange(index, id, e.target.value)
                          }
                          className={inputStyles}
                          disabled={index !== activeRow}
                          required
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
            <div className="flex justify-start gap-4 mt-4">
              <CommonButton
                type="button"
                onClick={handleAddProduct}
                disabled={isAddButtonDisabled()}
                buttonText="Add Another Product"
                // extraStyles={"w-full"}
              />
              <div className="w-full text-center text-xl">
                Total : ₹{total}
              </div>
            </div>
            <div className="mt-4">
              <CommonButton
                type="submit"
                buttonText={buttonText}
                disabled={isSubmitButtonDisabled()}
                extraStyles="w-full"
              />
            </div>
          </form>
        ) : (
          <CommonForm
            formControls={formControls}
            handleSubmit={handleSubmit}
            btnText={buttonText}
            searchOptions={searchOptions}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CommonDialog;