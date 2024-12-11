import CommonButton from "@/components/common-button";
import CommonDialog from "@/components/common-dialog";
import Header from "@/components/common-header";
import { ContextComponent } from "@/context";
import { useContext } from "react";

function HomePage() {
  const { setShowDialog } = useContext(ContextComponent);
  return (
    <div className="px-5">
      <Header />
      <div className="mt-5 flex">
        <CommonButton
          buttonText={"Add Employee"}
          onClick={() => setShowDialog(true)}
        />
      </div>
      <CommonDialog />
    </div>
  );
}

export default HomePage;
