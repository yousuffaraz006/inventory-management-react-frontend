import api from "@/api";
import CommonButton from "@/components/common-button";
import CommonForm from "@/components/common-form";
import Header from "@/components/common-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { updateEmployeeFormControls } from "@/config";
import { ContextComponent } from "@/context";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

function EmployeeDetail() {
  const {
    loading,
    setLoading,
    employee,
    setEmployee,
    setPhoneNo,
    setCheck,
    phoneNo,
    check,
    navigate,
  } = useContext(ContextComponent);
  const { pk } = useParams();
  useEffect(() => {
    getEmployeeDetail();
  }, []);
  const getEmployeeDetail = async () => {
    // setLoading(true);
    await api.get(`employee/${pk}/`).then((res) => {
      setEmployee(res.data);
      setPhoneNo(res.data.member_phone);
      setCheck(res.data.member_verified);
      // setLoading(false);
    });
  };
  const updateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .put(`employee/${pk}/`, {
        member_phone: phoneNo,
        member_verified: check,
      })
      .then(() => {
        setLoading(false);
        getEmployeeDetail();
        navigate("/");
      });
  };
  const deleteEmployee = async () => {
    setLoading(true);
    await api.delete(`employee/${pk}/`).then(() => {
      setLoading(false);
      navigate("/");
    });
  };
  if (loading) {
    return <Skeleton className={"w-full h-screen rounded-none bg-black opacity-70"} />;
  }
  return (
    <div className="px-5">
      <div className="mt-5 flex justify-between">
        <Card className="w-full bg-white shadow-lg rounded-lg text-black">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg font-bold">Employee Detail</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex ">
            <div className="w-1/2 pr-4">
              <div className="flex justify-center mb-4">
                <img
                  src={employee.member_image}
                  alt={`${employee.member_name}'s profile`}
                  className="h-24 w-24 rounded object-cover border-2 border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <div className="text-base font-medium">
                  <span className="font-semibold text-gray-700">Name: </span>
                  {employee.member_name}
                </div>
                <div className="text-base">
                  <span className="font-semibold text-gray-700">Email: </span>
                  {employee.member_email}
                </div>
              </div>
            </div>
            <div className="w-1/2 pl-4">
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <CommonForm
                  formControls={updateEmployeeFormControls}
                  btnText={"Update"}
                  handleSubmit={updateEmployee}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <p className="font-semibold text-gray-700">Delete Employee?</p>
            <CommonButton
              onClick={() => deleteEmployee()}
              buttonText={"DELETE"}
              extraStyles={
                "px-4 py-2 bg-red-600 text-white border-0 rounded-md shadow hover:bg-red-700 hover:text-white transition"
              }
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeDetail;
