import { Button } from "../ui/button";

function CommonButton({ onClick, buttonText, type, disabled, extraStyles }) {
  return (
    <Button
      type={type || "submit"}
      onClick={onClick || null}
      disabled={disabled || false}
      className={`flex h-11 justify-center items-center px-5 bg-black font-extrabold text-white border-black border-2 rounded hover:bg-white hover:text-black ${extraStyles}`}
    >
      {buttonText}
    </Button>
  );
}

export default CommonButton;