import { ContextComponent } from "@/context";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import CommonForm from "../common-form";
import { searchFormControls } from "@/config";

function Header() {
  const { toast, navigate, resetStates } = useContext(ContextComponent);
  async function handleLogout() {
    localStorage.clear();
    resetStates();
    navigate("/signin");
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully.",
    });
  }
  const handleSearch = (e) => {
    e.preventDefault();
  };
  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto h-16">
        <div className="flex h-[64px] items-center w-full justify-between ">
          <div className="w-auto">
            <h1 className="text-xl">{}</h1>
          </div>
          <div className="w-[50%] mb-4">
            <CommonForm
              formControls={searchFormControls}
              btnText={"Search"}
              buttonDisable={true}
              labelDisable={true}
              handleSubmit={handleSearch}
            />
          </div>
          <div>
            <LogOut
              onClick={handleLogout}
              color="#000"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
