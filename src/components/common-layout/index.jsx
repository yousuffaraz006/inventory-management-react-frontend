import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { ContextComponent } from "@/context";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../common-sidebar";
import CreateCompany from "@/pages/companyPage";

function CommonLayout() {
  const {
    isAuthorized,
    setIsAuthorized,
    auth,
    setSearchText,
    lastPart,
    getCompany,
    loading,
    setLoading,
  } = useContext(ContextComponent);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        await auth();
        setIsAuthorized(true);
        await getCompany();
      } catch {
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setSearchText("");
  }, [lastPart]);

  if (isAuthorized === null || loading) {
    return (
      <Skeleton className="w-full h-screen rounded-none bg-black opacity-70" />
    );
  }

  return (
    <div>
      {isAuthorized ? (
        !localStorage.getItem("company_name") ||
        localStorage.getItem("company_name") === "null" ? (
          <CreateCompany />
        ) : (
          <SidebarProvider>
            <AppSidebar className="w-64" />
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarProvider>
        )
      ) : (
        <Navigate to="/signin" />
      )}
    </div>
  );
}

export default CommonLayout;
