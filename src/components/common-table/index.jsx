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
        setProductName(data.name);
        setProductRate(data.rate);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const computeStock = (products, purchases) => {
    return products.map((product) => {
      const stock = purchases
        .flatMap((purchase) => purchase.items) // Extract all items from purchases
        .filter((item) => item.product.id === product.id) // Match items to the current product
        .reduce((total, item) => total + item.quantity, 0);
      return { ...product, stock };
    });
  };
  useEffect(() => {
    const enrichedProducts = computeStock(productsList, purchasesList);
    setProductsList(enrichedProducts);
  }, [purchasesList]);

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow
          className="grid grid-cols-5 gap-4 mt-3"
          style={{
            gridTemplateColumns: "2fr 1fr 0.5fr 0.5fr 0.5fr",
          }}
        >
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
            return (
              <TableRow
                key={item.id}
                className="grid grid-cols-5 gap-4 hover:bg-blue-400 cursor-pointer"
                style={{
                  gridTemplateColumns: "2fr 1fr 0.5fr 0.5fr 0.5fr",
                }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  &#8377; {formatToIndianNumberSystem(item.rate)}
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
