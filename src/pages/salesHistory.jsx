import CommonButton from "@/components/common-button";
import Header from "@/components/common-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContextComponent } from "@/context";
import html2pdf from "html2pdf.js";
import { useContext, useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import api from "@/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SalesHistory() {
  const {
    setSalesList,
    salesList,
    getSales,
    formatToIndianNumberSystem,
    navigate,
    loading,
    currentPage,
    setPageSize,
    pageSize,
    totalPages,
    toast,
    setMode,
    searchText,
  } = useContext(ContextComponent);
  useEffect(() => {
    getSales(currentPage, pageSize);
  }, [currentPage, pageSize]);
  useEffect(() => {
    {
      searchText.length > 1
        ? api
            .get(`https://inventorymanager.pythonanywhere.com/search-sales/?search=${searchText}`)
            .then((res) => {
              setSalesList(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              toast({
                title: "Error occured : " + err.message,
              });
            })
        : getSales(currentPage, pageSize);
    }
  }, [searchText]);
  const inputStyles =
    "w-full rounded h-[50px] border-none text-black bg-gray-200 text-[16px] outline-none drop-shadow-sm transition-all duration-300 ease-in-out focus:bg-gray-100 focus:drop-shadow-lg focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";
  const middlePage = Math.ceil(totalPages / 2);

  const handleNext = () => {
    if (currentPage < totalPages) {
      getSales(currentPage + 1, pageSize);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      getSales(currentPage - 1, pageSize);
    }
  };

  const handlePageClick = (page) => {
    getSales(page, pageSize);
  };
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
          buttonText={"Create Sale"}
          onClick={() => navigate("/")}
        />
      </div>
      {salesList?.length > 0 ? (
        salesList.map((item) => {
          const dateTime = item.sale_date.split("T");
          const date = dateTime[0]; // Extract the date part
          const time = dateTime[1].split(".")[0];
          return (
            <Accordion key={item.id} type="single" className="my-5" collapsible>
              <AccordionItem
                value={`item-${item.id}`}
                className="bg-blue-400 text-black rounded"
              >
                <AccordionTrigger className="flex">
                  <p>{item.sale_slug}</p>
                  <p>By :-{item.sale_created_by}</p>
                  <p>{date}</p>
                </AccordionTrigger>
                <AccordionContent className="bg-white rounded border-black border-2 text-black p-3">
                  <CommonButton
                    buttonText={"Download"}
                    onClick={() => {
                      const element = document.getElementById(`pdf-${item.id}`); // Unique ID
                      if (element) {
                        const options = {
                          margin: 10,
                          filename: `Invoice-${item.sale_slug}.pdf`,
                          html2canvas: { scale: 2 }, // High resolution
                          jsPDF: {
                            unit: "mm",
                            format: "a4",
                            orientation: "portrait",
                          },
                        };
                        html2pdf().set(options).from(element).save();
                      } else {
                        console.error("Invoice element not found!");
                      }
                    }}
                  />
                  <div className="my-5" id={`pdf-${item.id}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-6xl font-serif font-bold"></div>
                      <div className="text-right">
                        <h2 className="text-3xl font-serif font-bold tracking-widest">
                          INVOICE
                        </h2>
                        <p className="mt-2">{item.sale_slug}</p>
                        <p>
                          {date}
                          <br />
                          {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h1 className="text-2xl font-bold text-red-500">
                          {item.company.company_name}
                        </h1>
                        <p className="text-gray-600">
                          {item.company.company_address.split(",")[0]}
                        </p>
                        <p className="text-gray-600">
                          {item.company.company_address.split(",")[1]}
                        </p>
                        <p className="text-gray-600">
                          {item.company.company_address.split(",")[2]}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">Billed To:</p>
                        <p className="font-bold">
                          {item.sale_customer.customer_name}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {item.sale_customer.customer_phone}
                        </p>
                        <p className="text-gray-600">
                          {item.sale_customer.customer_email}
                        </p>
                      </div>
                    </div>

                    <Table className="w-full">
                      <TableHeader>
                        <TableRow
                          className="grid grid-cols-5 gap-4 border-b pb-2 hover:bg-white"
                          style={{
                            gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr",
                          }}
                        >
                          <TableHead>S.No</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.items?.map((item, index) => (
                          <TableRow
                            key={index}
                            className="grid grid-cols-5 gap-4 hover:bg-white"
                            style={{
                              gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr",
                            }}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              {item.s_item_product.product_name}
                            </TableCell>
                            <TableCell>{item.s_item_quantity}</TableCell>
                            <TableCell>
                              {formatToIndianNumberSystem(item.s_item_price)}
                            </TableCell>
                            <TableCell>
                              ₹
                              {formatToIndianNumberSystem(
                                item.s_item_price * item.s_item_quantity
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-between">
                      <div></div> {/* Empty placeholder for layout alignment */}
                      <div className="font-bold text-2xl">
                        Grand Total: ₹
                        {formatToIndianNumberSystem(item.sale_total)}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })
      ) : (
        <div>No sales found with the search phrase above.</div>
      )}
      {searchText.length < 2 && (
        <Pagination className={"justify-between"}>
          <div>
            <Select
              value={pageSize}
              onValueChange={(value) => {
                setPageSize(value);
                getSales(1, value);
              }}
            >
              <SelectTrigger className={inputStyles}>
                <SelectValue
                  placeholder="Select pagination size"
                  className="text-black focus:text-black"
                />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="5">5</SelectItem>
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

export default SalesHistory;
