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
import { useContext, useEffect } from "react";

// function SalesHistory() {
//   const { salesList, getSales, formatToIndianNumberSystem, navigate, loading } =
//     useContext(ContextComponent);
//   useEffect(() => {
//     getSales();
//   }, []);
//   if (loading) {
//     return (
//       <Skeleton
//         className={"w-full h-screen rounded-none bg-black opacity-70"}
//       />
//     );
//   }
//   return (
//     <div className="px-5">
//       <Header />
//       <div className="mt-5">
//         <CommonButton
//           buttonText={"Create Sale"}
//           onClick={() => navigate("/")}
//         />
//       </div>
//       {salesList?.length > 0 ? (
//         salesList.map((item) => {
//           const dateTime = item.sale_date.split("T");
//           const date = dateTime[0]; // Extract the date part
//           const time = dateTime[1].split(".")[0];
//           return (
//             <Accordion key={item.id} type="single" className="my-5" collapsible>
//               <AccordionItem
//                 value={`item-${item.id}`}
//                 className="bg-blue-400 text-black rounded"
//               >
//                 <AccordionTrigger className="flex">
//                   <p>{item.sale_slug}</p>
//                   <p>By :-{item.sale_created_by}</p>
//                   <p>{date}</p>
//                 </AccordionTrigger>
//                 <AccordionContent className="bg-white rounded border-black border-2 text-black p-3">
//                   <CommonButton
//                     buttonText={"Download"}
//                     onClick={() => {
//                       const element = document.getElementById(`pdf-${item.id}`); // Unique ID
//                       if (element) {
//                         const options = {
//                           margin: 10,
//                           filename: `Invoice-${item.sale_slug}.pdf`,
//                           html2canvas: { scale: 2 }, // High resolution
//                           jsPDF: {
//                             unit: "mm",
//                             format: "a4",
//                             orientation: "portrait",
//                           },
//                         };
//                         html2pdf().set(options).from(element).save();
//                       } else {
//                         console.error("Invoice element not found!");
//                       }
//                     }}
//                   />
//                   <div className="my-5" id={`pdf-${item.id}`}>
//                     <div className="flex justify-between items-start mb-6">
//                       <div className="text-6xl font-serif font-bold"></div>
//                       <div className="text-right">
//                         <h2 className="text-3xl font-serif font-bold tracking-widest">
//                           INVOICE
//                         </h2>
//                         <p className="mt-2">{item.sale_slug}</p>
//                         <p>
//                           {date}
//                           <br />
//                           {time}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex justify-between items-start mb-5">
//                       <div>
//                         <h1 className="text-2xl font-bold text-red-500">
//                           {item.company.company_name}
//                         </h1>
//                         <p className="text-gray-600">
//                           {item.company.company_address.split(",")[0]}
//                         </p>
//                         <p className="text-gray-600">
//                           {item.company.company_address.split(",")[1]}
//                         </p>
//                         <p className="text-gray-600">
//                           {item.company.company_address.split(",")[2]}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-lg font-semibold">Billed To:</p>
//                         <p className="font-bold">
//                           {item.sale_customer.customer_name}
//                         </p>
//                         <p className="text-gray-600 mt-2">
//                           {item.sale_customer.customer_phone}
//                         </p>
//                         <p className="text-gray-600">
//                           {item.sale_customer.customer_email}
//                         </p>
//                       </div>
//                     </div>

//                     <Table className="w-full">
//                       <TableHeader>
//                         <TableRow
//                           className="grid grid-cols-5 gap-4 border-b pb-2 hover:bg-white"
//                           style={{
//                             gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr",
//                           }}
//                         >
//                           <TableHead>S.No</TableHead>
//                           <TableHead>Product</TableHead>
//                           <TableHead>Quantity</TableHead>
//                           <TableHead>Price</TableHead>
//                           <TableHead>Total</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {item.items?.map((item, index) => (
//                           <TableRow
//                             key={index}
//                             className="grid grid-cols-5 gap-4 hover:bg-white"
//                             style={{
//                               gridTemplateColumns: "0.25fr 3fr 0.75fr 1fr 1fr",
//                             }}
//                           >
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>
//                               {item.s_item_product.product_name}
//                             </TableCell>
//                             <TableCell>{item.s_item_quantity}</TableCell>
//                             <TableCell>
//                               {formatToIndianNumberSystem(item.s_item_price)}
//                             </TableCell>
//                             <TableCell>
//                               ₹
//                               {formatToIndianNumberSystem(
//                                 item.s_item_price * item.s_item_quantity
//                               )}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>

//                     <div className="mt-4 flex justify-between">
//                       <div></div> {/* Empty placeholder for layout alignment */}
//                       <div className="font-bold text-2xl">
//                         Grand Total: ₹
//                         {formatToIndianNumberSystem(item.sale_total)}
//                       </div>
//                     </div>
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             </Accordion>
//           );
//         })
//       ) : (
//         <div>No sales found with the search phrase above.</div>
//       )}
//     </div>
//   );
// }

// export default SalesHistory;

import { useState } from "react";

function SalesHistory() {
  const { salesList, getSales, formatToIndianNumberSystem, navigate, loading } =
    useContext(ContextComponent);

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    getSales();
  }, []);

  if (loading) {
    return (
      <Skeleton
        className={"w-full h-screen rounded-none bg-black opacity-70"}
      />
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(salesList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSalesList = salesList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="px-5">
      <Header />
      <div className="mt-5">
        <CommonButton
          buttonText={"Create Sale"}
          onClick={() => navigate("/")}
        />
      </div>
      {currentSalesList?.length > 0 ? (
        currentSalesList.map((item) => {
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
      {/* Pagination Controls */}
      <div className="flex justify-between mt-5">
        <button
          disabled={currentPage === 1}
          onClick={handlePrevious}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-lg font-bold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SalesHistory;
