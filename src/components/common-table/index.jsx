import { useContext, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ContextComponent } from "@/context";
import CommonButton from "../common-button";
import api from "@/api";
import { number } from "zod";

function CommonTable({ list, item }) {
  const {
    setShowDialog,
    setCurrentDeleteId,
    setCurrentUpdateId,
    setProductName,
    setProductRate,
    formatToIndianNumberSystem,
    getPurchases,
    getProducts,
    purchasesList,
    setProductsList,
    productsList,
    salesList,
  } = useContext(ContextComponent);
  useEffect(() => {
    getProducts();
    getPurchases();
  }, []);
  const productDetail = async (id) => {
    await api
      .get(`/product/${id}/`)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setProductName(data.product_name);
        setProductRate(data.product_rate);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const computeStock = (products, purchases, sales) => {
    return products.map((product) => {
      const purchaseStock = purchases
        .flatMap((purchase) => purchase.items) // Extract all items from purchases
        .filter((item) => item.p_item_product.id === product.id) // Match items to the current product
        .reduce((total, item) => total + item.p_item_quantity, 0);
      const saleStock = sales
        .flatMap((sale) => sale.items) // Extract all items from purchases
        .filter((item) => item.s_item_product.id === product.id) // Match items to the current product
        .reduce((total, item) => total + item.s_item_quantity, 0);
      const stock = purchaseStock - saleStock;
      return { ...product, stock };
    });
  };
  useEffect(() => {
    const enrichedProducts = computeStock(productsList, purchasesList, salesList);
    setProductsList(enrichedProducts);
  }, [purchasesList]);
  // const employerPresent = localStorage.getItem("groups") === "employer"

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow
          className="grid grid-cols-5 gap-4 mt-3"
          style={{
            gridTemplateColumns: `${localStorage.getItem("groups") === "employer" ? "0.75fr 0.75fr" : ""} 2fr 1fr 0.5fr 0.5fr 0.5fr`,
          }}
        >
          {localStorage.getItem("groups") === "employer" && (
            <>
              <TableHead>By</TableHead>
              <TableHead>Date</TableHead>
            </>
          )}
          <TableHead>Product</TableHead>
          <TableHead>Rate</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Update</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      {list?.length > 0 ? (
        <TableBody>
          {list.map((item) => {
            const dateTime = item.product_created_date.split("T");
            const date = dateTime[0]; // Extract the date part
            const time = dateTime[1].split(".")[0];
            return (
              <TableRow
                key={item.id}
                className="grid grid-cols-5 gap-4 hover:bg-blue-400 cursor-pointer"
                style={{
                  gridTemplateColumns: `${localStorage.getItem("groups") === "employer" ? "0.75fr 0.75fr" : ""} 2fr 1fr 0.5fr 0.5fr 0.5fr`,
                }}
              >
                {localStorage.getItem("groups") === "employer" && (
                  <>
                    <TableCell>{item.product_created_by}</TableCell>
                    <TableCell>{date + " " + time}</TableCell>
                  </>
                )}
                <TableCell>{item.product_name}</TableCell>
                <TableCell>
                  &#8377; {formatToIndianNumberSystem(item.product_rate)}
                </TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <CommonButton
                    onClick={() => {
                      productDetail(item.id);
                      setCurrentUpdateId(item.id);
                      setShowDialog(true);
                    }}
                    buttonText={"UPDATE"}
                    extraStyles={
                      "px-2 h-7 text-xs font-bold bg-gray-300 text-black"
                    }
                  />
                </TableCell>
                <TableCell>
                  <CommonButton
                    onClick={() => {
                      setCurrentDeleteId(item.id);
                      setShowDialog(true);
                    }}
                    buttonText={"DELETE"}
                    extraStyles={
                      "px-2 h-7 text-xs font-bold bg-gray-300 text-black"
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      ) : (
        <caption>No {item} found with the search phrase above.</caption>
      )}
    </Table>
  );
}

export default CommonTable;
