import api from "@/api";
import CommonButton from "@/components/common-button";
import Header from "@/components/common-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContextComponent } from "@/context";
import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PurchasesHistory() {
  const {
    setLoading,
    loading,
    setPurchasesList,
    purchasesList,
    formatToIndianNumberSystem,
    searchText,
    getProducts,
    getPurchases,
    toast,
    navigate,
    currentPage,
    pageSize,
    setPageSize,
    setMode,
    totalPages,
  } = useContext(ContextComponent);
  useEffect(() => {
    getPurchases(currentPage, pageSize);
    getProducts();
  }, [currentPage, pageSize]);
  useEffect(() => {
    {
      searchText.length > 1
        ? api
            .get(`https://inventorymanager.pythonanywhere.com/search-purchases/?search=${searchText}`)
            .then((res) => {
              setPurchasesList(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              toast({
                title: "Error occured : " + err.message,
              });
            })
        : getPurchases(currentPage, pageSize);
    }
  }, [searchText]);

  const middlePage = Math.ceil(totalPages / 2);

  const handleNext = () => {
    if (currentPage < totalPages) {
      getPurchases(currentPage + 1, pageSize);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      getPurchases(currentPage - 1, pageSize);
    }
  };

  const handlePageClick = (page) => {
    getPurchases(page, pageSize);
  };

  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  if (loading) {
    return (
      <Skeleton
        className={"w-full h-screen rounded-none bg-black opacity-70"}
      />
    );
  }
  return (
    <div className="px-5">
      <Header />
      <div className="mt-5">
        <CommonButton
          buttonText={"Create Purchase"}
          onClick={() => {
            navigate("/");
            setMode("Purchase");
          }}
        />
      </div>
      {purchasesList?.length > 0 ? (
        purchasesList.map((item) => (
          <Accordion key={item.id} type="single" className="my-5" collapsible>
            <AccordionItem
              value={`item-${item.id}`}
              className="bg-blue-400 text-black rounded"
            >
              <AccordionTrigger className="flex">
                <p>{item.purchase_slug}</p>
                <p>By :-{item.purchase_created_by}</p>
                <p>{item.purchase_date}</p>
                <p>
                  Total : &#8377;
                  {formatToIndianNumberSystem(item.purchase_total)}
                </p>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-300 rounded text-black p-3">
                <div
                  className="grid grid-cols-3"
                  style={{
                    gridTemplateColumns: "3fr 0.75fr 0.25fr",
                  }}
                >
                  <p className="font-bold">Product</p>
                  <p className="font-bold">Cost</p>
                  <p className="font-bold">Quantity</p>
                </div>
                {item.items?.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 hover:bg-white hover:text-black hover:cursor-pointer"
                    style={{
                      gridTemplateColumns: "3fr 0.75fr 0.25fr",
                    }}
                  >
                    <p>{item.p_item_product.product_name}</p>
                    <p>
                      &#8377;
                      {formatToIndianNumberSystem(item.p_item_cost)}
                    </p>
                    <p>{item.p_item_quantity}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
      ) : (
        <div>No purchases found with the search phrase above.</div>
      )}
      {searchText.length < 2 && (
        <Pagination className={"justify-between"}>
          <div>
            <Select
              value={pageSize}
              onValueChange={(value) => {
                setPageSize(value);
                getPurchases(1, value);
              }}
            >
              <SelectTrigger className={inputStyles}>
                <SelectValue
                  placeholder="Select pagination size"
                  className="text-black focus:text-black"
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <PaginationContent>
            <CommonButton
              buttonText={"← Previous"}
              onClick={handlePrevious}
              disabled={currentPage === 1}
            />
            {totalPages > 10 ? (
              <>
                <PaginationItem>
                  <CommonButton
                    buttonText={"1"}
                    onClick={() => handlePageClick(1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <CommonButton
                    buttonText={middlePage - 1}
                    onClick={() => handlePageClick(middlePage - 1)}
                    disabled={currentPage === middlePage - 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <CommonButton
                    buttonText={middlePage}
                    onClick={() => handlePageClick(middlePage)}
                    disabled={currentPage === middlePage}
                  />
                </PaginationItem>
                <PaginationItem>
                  <CommonButton
                    buttonText={middlePage + 1}
                    onClick={() => handlePageClick(middlePage + 1)}
                    disabled={currentPage === middlePage + 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <CommonButton
                    buttonText={totalPages}
                    onClick={() => handlePageClick(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </>
            ) : (
              <>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index + 1}>
                    <CommonButton
                      buttonText={String(index + 1)}
                      onClick={() => handlePageClick(index + 1)}
                      disabled={currentPage === index + 1}
                    />
                  </PaginationItem>
                ))}
              </>
            )}
            <CommonButton
              buttonText={"Next →"}
              onClick={handleNext}
              disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default PurchasesHistory;
