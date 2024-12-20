import api from "@/api";
import CommonForm from "@/components/common-form";
import { Skeleton } from "@/components/ui/skeleton";
import { companyDetailsFormControls } from "@/config";
import { ContextComponent } from "@/context";
import { useContext } from "react";

function CreateCompany() {
  const {
    loading,
    setLoading,
    companyName,
    setCompanyName,
    companyPhone,
    setCompanyPhone,
    companyEmail,
    setCompanyEmail,
    companyAddress,
    setCompanyAddress,
    toast,
    navigate,
  } = useContext(ContextComponent);
  const updateCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem("company_name", companyName);
      await api.put("/company/", {
        company_name: companyName,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_address: companyAddress,
      });
      toast({
        title: "Company Created Successfully",
        description: "You can now add your employees.",
      });
      setCompanyName("");
      setCompanyPhone("");
      setCompanyEmail("");
      setCompanyAddress("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Skeleton
        className={"w-full h-screen rounded-none bg-black opacity-70"}
      />
    );
  }
  return (
    <div className="contaner">
      <div className="card">
        <h1 className="heading">Welcome!</h1>
        <p className="subheading">
          Let's set up your company. Fill in the details below to get started.
        </p>
        <div className="formContainer">
          <CommonForm
            formControls={companyDetailsFormControls}
            btnText={"Create Company"}
            handleSubmit={updateCompany}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateCompany;
