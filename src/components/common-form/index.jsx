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
 
function CommonForm({ formControls = [], btnText, handleSubmit }) {
  const {
    loading,
    formData,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    username,
    setUsername,
    password,
    setPassword,
  } = useContext(ContextComponent);
  const setValue = (label) => {
    return label === "First Name"
      ? firstname
      : label === "Last Name"
      ? lastname
      : label === "Username"
      ? username
      : label === "Password"
      ? password
      : null;
  };
  const setState = (label, value) => {
    label === "First Name"
      ? setFirstname(value)
      : label === "Last Name"
      ? setLastname(value)
      : label === "Username"
      ? setUsername(value)
      : label === "Password"
      ? setPassword(value)
      : null;
  };
  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
  return (
    <Form {...formData}>
      <form onSubmit={handleSubmit}>
        {formControls?.length > 0
          ? formControls.map(({ id, label, componentType, placeholder, type, options }) => (
              <FormField
                control={formData.control}
                key={id}
                name={id}
                render={() => {
                  return (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      {componentType === "input" ? (
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            type={type}
                            value={setValue(label)}
                            onChange={(e) =>
                              setState(label, e.target.value)
                            }
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
                      ) : null}
                    </FormItem>
                  );
                }}
              />
            ))
          : null}
        {loading && <LoadingIndicator />}
        <div className="flex mt-4 justify-center items-center">
          <CommonButton type={"submit"} buttonText={btnText} />
        </div>
      </form>
    </Form>
  );
}

export default CommonForm;
