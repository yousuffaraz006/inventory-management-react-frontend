import { useContext } from "react";
import CommonForm from "../common-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { ContextComponent } from "@/context";
("use client");

function CommonDialog({
  title,
  formControls,
  handleSubmit,
  buttonText,
}) {
  const {
    showDialog,
    setShowDialog,
    currentDeleteId,
    setCurrentDeleteId,
    setCurrentUpdateId,
    setProductName,
    setProductRate,
    setFirstName,
    setLastName,
    setUsername,
    setPassword,
    setPhoneNo,
  } = useContext(ContextComponent);

  const resetDialogState = () => {
    setShowDialog(false);
    setCurrentDeleteId(null);
    setCurrentUpdateId(null);
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setProductName("");
    setProductRate("");
    setPhoneNo("");
  };

  return (
    <Dialog
      open={showDialog}
      onOpenChange={() => resetDialogState()}
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
        <CommonForm
          formControls={formControls}
          handleSubmit={handleSubmit}
          btnText={buttonText}
        />
      </DialogContent>
    </Dialog>
  );
}

export default CommonDialog;
