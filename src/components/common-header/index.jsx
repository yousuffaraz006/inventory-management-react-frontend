import { ContextComponent } from "@/context";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Header() {
  const { toast, navigate } = useContext(ContextComponent);
  async function handleLogout() {
    localStorage.clear();
    navigate("/signin");
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully.",
    });
  }

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto h-16">
        <div className="flex h-[64px] items-center w-full justify-between ">
          <div className="w-auto">
            <h1 className="text-xl">Welcome to ABC XYZ Co.</h1>
          </div>
          <div className="flex gap-4">
            <Link className="text-black text-xl font-bold" to={"/"}>
              Home
            </Link>
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
