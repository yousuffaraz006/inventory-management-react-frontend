import api from "@/api";
import CommonButton from "@/components/common-button";
import CommonDialog from "@/components/common-dialog";
import Header from "@/components/common-header";
import CommonTable from "@/components/common-table";
import { Skeleton } from "@/components/ui/skeleton";
import { productFormControls } from "@/config";
import { ContextComponent } from "@/context";
import { useContext, useEffect } from "react";

function Products() {
  const {
    productsList,
    setProductsList,
    setLoading,
    loading,
    setShowDialog,
    setProductName,
    productName,
    setProductRate,
    productRate,
    setCurrentDeleteId,
    currentDeleteId,
    setCurrentUpdateId,
    currentUpdateId,
    searchText,
    toast,
    allPurchasesList,
    allSalesList,
    getProducts,
    getAllPurchases,
    getAllSales,
  } = useContext(ContextComponent);
  useEffect(() => {
    (async () => {
      await getAllPurchases();
      await getAllSales();
      await getProducts();
    })();
  }, []);
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
    api
      .get(`https://inventorymanager.pythonanywhere.com/search-products/?search=${searchText}`)
      .then((res) => {
        const enrichedProducts = computeStock(
          res.data,
          allPurchasesList,
          allSalesList
        );
        setProductsList(enrichedProducts);
      })
      .catch((err) => {
        toast({
          title: "Error occured : " + err.message,
        });
      });
  }, [searchText]);
  const createProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .post("/products/", {
        product_name: productName,
        product_rate: productRate,
      })
      .then(() => {
        setShowDialog(false);
        getProducts();
        setProductName("");
        setProductRate("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .put(`/product/${currentUpdateId}/`, {
        product_name: productName,
        product_rate: productRate,
      })
      .then(() => {
        setShowDialog(false);
        getProducts();
        setCurrentUpdateId(null);
        setProductName("");
        setProductRate("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const deleteProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .delete(`/product/${currentDeleteId}/`)
      .then(() => {
        setShowDialog(false);
        getProducts();
        setCurrentDeleteId(null);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSubmit = async (e) => {
    currentUpdateId
      ? updateProduct(e)
      : currentDeleteId
      ? deleteProduct(e)
      : createProduct(e);
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
        <div>
          <CommonButton
            buttonText={"Create Product"}
            onClick={() => setShowDialog(true)}
          />
        </div>
        <CommonTable list={productsList} item={"products"} />
        <CommonDialog
          title={
            currentDeleteId
              ? "Delete Product"
              : currentUpdateId
              ? "Update Product"
              : "Create Product"
          }
          formControls={currentDeleteId ? null : productFormControls}
          handleSubmit={handleSubmit}
          buttonText={
            currentDeleteId ? "Delete" : currentUpdateId ? "Save" : "Create"
          }
        />
      </div>
    </div>
  );
}

export default Products;
