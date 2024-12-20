import api from "@/api";
import CommonButton from "@/components/common-button";
import CommonForm from "@/components/common-form";
import { Skeleton } from "@/components/ui/skeleton";
import { signInFormControls } from "@/config";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { ContextComponent } from "@/context";
import { useContext } from "react";

function SignIn() {
  const {
    setLoading,
    username,
    password,
    setUsername,
    setPassword,
    toast,
    navigate,
    setIsAuthorized,
  } = useContext(ContextComponent);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsAuthorized(true);
    try {
      const { data } = await api.post("/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, data.access);
      localStorage.setItem(REFRESH_TOKEN, data.refresh);
      navigate("/");
      toast({
        title: "Signed In Successfully",
        description: `Logged in as ${username}!`,
      });
      setUsername("");
      setPassword("");
    } catch (error) {
      toast({
        title: "ERROR!",
        description: "" + error,
      });
    }
  };
  return (
    <div className="flex flex-auto flex-col min-h-screen h-full">
      <div className="flex flex-col h-full justify-center items-center bg-white">
        <h3 className="text-3xl font-bold">Welcome</h3>
        <div className="mt-4 ">
          <CommonForm
            formControls={signInFormControls}
            btnText={"Sign In"}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="mt-5">
          <CommonButton
            onClick={() => navigate("/signup")}
            className="text-white mt-6 px-4 py-3 font-extralight border-none"
            buttonText={"Switch to Sign Up"}
            type={"button"}
          />
        </div>
      </div>
    </div>
  );
}

export default SignIn;
