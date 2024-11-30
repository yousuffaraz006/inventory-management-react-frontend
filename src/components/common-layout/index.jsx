import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { ContextComponent } from "@/context";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../common-sidebar";

function CommonLayout() {
  const { isAuthorized, setIsAuthorized, auth } = useContext(ContextComponent);
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        await auth();
      } catch {
        setIsAuthorized(false);
      }
    };

    checkAuthorization();
  }, []);
  if (isAuthorized === null) {
    return (
      <Skeleton
        className={`w-full h-[740px]  rounded-[6px] bg-black opacity-50`}
      />
    );
  }
  return (
    <div>
      {isAuthorized ? (
        <SidebarProvider>
          <AppSidebar className="w-64" />
          <main className="flex-1">
            <Outlet />
          </main>
        </SidebarProvider>
      ) : (
        <Navigate to="/signin" />
      )}
    </div>
  );
}

export default CommonLayout;
