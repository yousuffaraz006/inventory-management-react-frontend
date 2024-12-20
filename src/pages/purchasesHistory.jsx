import api from "@/api";
import CommonButton from "@/components/common-button";
import CommonDialog from "@/components/common-dialog";
import Header from "@/components/common-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { purchaseFormControls } from "@/config";
import { ContextComponent } from "@/context";
import { useContext, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PurchasesHistory() {
  const {
    setLoading,
    loading,
    setPurchasesList,
    purchasesList,
    formatToIndianNumberSystem,
    setShowDialog,
    searchText,
    productsList,
    getProducts,
    getPurchases,
    productsSet,
    toast,
    setProductsSet,
  } = useContext(ContextComponent);
  useEffect(() => {
    getPurchases();
    getProducts();
  }, []);
  useEffect(() => {
    api
      .get(`http://127.0.0.1:8000/search-purchases/?search=${searchText}`)
      .then((res) => {
        setPurchasesList(res.data);
      })
      .catch((err) => {
        toast({
          title: "Error occured : " + err.message,
        });
      });
  }, [searchText]);
  const getProductIdByName = (name) => {
    const product = productsList.find((item) => item.product_name === name);
    return product ? product.id : null; // Return the ID or null if not found
  };
  const purchase_total = productsSet.reduce(
    (acc, product) =>
      acc +
      parseFloat(product.purchaseCost) * parseFloat(product.purchaseQuantity),
    0
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    api
      .post("/purchases/", {
        items: productsSet?.map((product) => ({
          p_item_product: getProductIdByName(product.productName),
          p_item_cost: product.purchaseCost,
          p_item_quantity: product.purchaseQuantity,
        })),
        purchase_total,
      })
      .then((res) => {
        if (res.status === 201) {
          toast({
            title: "Purchase placed successfully!",
          });
        } else {
          toast({
            title: "Error",
            description: "Order not created : " + res.status,
          });
        }
        setProductsSet([
          { productName: "", purchaseCost: "", purchaseQuantity: "" },
        ]);
        setShowDialog(false);
        getPurchases();
        setLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "" + err,
        });
        setLoading(false);
      });
  };
  const productNames = productsList.map((product) => {
    return {
      id: product.id,
      name: product.product_name,
    };
  });
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
          onClick={() => setShowDialog(true)}
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
                <p>Total : &#8377;{formatToIndianNumberSystem(item.purchase_total)}</p>
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
      <CommonDialog
        title={"Purchase Products"}
        formControls={purchaseFormControls}
        buttonText={"Purchase"}
        searchOptions={productNames}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default PurchasesHistory;
