import CommonButton from "@/components/common-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContextComponent } from "@/context";
import { useContext, useEffect } from "react";

function EmployerView({ navigate, setShowDialog }) {
  const { getEmployees, employeesList } = useContext(ContextComponent);
  useEffect(() => {
    getEmployees();
  }, []);
  return (
    <div className="mt-5 flex justify-between">
      <Card className="w-[30%] text-black shadow-md">
        <CardHeader className="p-3 flex flex-row justify-between">
          <CardTitle className="pt-3">Employees</CardTitle>
          <CommonButton
            buttonText={"+"}
            onClick={() => setShowDialog(true)}
            extraStyles={"h-10 w-10 text-4xl pb-4"}
          />
        </CardHeader>
        <CardContent className="p-3">
          {employeesList.length > 0 ? (
            employeesList.map((employee, index) => (
              <div
                key={index}
                className="flex flex-row justify-between p-3 border-b border-b-slate-300"
              >
                <CardDescription
                  key={index}
                  className="text-black hover:cursor-pointer font-bold flex"
                  onClick={() => {
                    navigate(`/employee/${employee.id}`);
                  }}
                >
                  <img
                    src={employee.image}
                    alt={`${employee.name}'s profile`}
                    className="h-7 w-7 rounded-full object-cover border-2 border-gray-300 mt-1"
                  />
                  <p className="text-2xl text-blue-500 underline">
                    {employee.member_name}
                  </p>
                </CardDescription>
                <span
                  className={`w-2 h-2 mt-3 bg-gray-200 rounded-full ${
                    employee.member_verified ? "glow" : ""
                  }`}
                ></span>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full border-b border-b-slate-300">
              <p className="text-black mb-2">No Employees</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployerView;
