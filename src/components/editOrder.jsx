import { useEffect, useState } from "react";

import { ConfigProvider, Select, theme, InputNumber } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditOrder = ({
  refresh,
  setRefresh,
  orderId,
  setShowEditOrder,
  orderDetails,
}) => {
  const { id } = useParams();
  const [selectOrderItems, setSelectOrderItems] = useState({
    color: "",
    size: "",
    quantity: "",
  });

  const [availableStokes, setAvailableStokes] = useState(10);

  const [itemsDetailes, setItemsDetailes] = useState([]);

  useEffect(() => {
    // console.log("orderDetails", orderDetails.OrderDetails.find((item) => item.id === orderId));
    setItemsDetailes({
      orderSpesificItems: orderDetails.OrderDetails.find(
        (item) => item.id === orderId
      ),
      productsDetails: orderDetails.productsDetails.find(
        (item) => item.id === orderId
      ),
    });

    setSelectOrderItems({
      color: orderDetails.OrderDetails.find((item) => item.id === orderId)
        .color,
      size: orderDetails.OrderDetails.find((item) => item.id === orderId).size,
      quantity: orderDetails.OrderDetails.find((item) => item.id === orderId)
        .quantity,
    });
  }, []);
  console.log("itemsDetailes", itemsDetailes);

  useEffect(() => {
    let quantity = itemsDetailes?.orderSpesificItems?.quantity;
    let stock = itemsDetailes?.productsDetails?.stock;
    setAvailableStokes(stock + quantity);
  }, [itemsDetailes]);

  console.log("availableStokes", availableStokes);

  const updateOrderDetails = async () => {
    const DataSend = orderDetails.OrderDetails.filter(
      (item) => item.id !== orderId
    );

    DataSend.push({
      id: orderId,
      color: selectOrderItems.color,
      size: selectOrderItems.size,
      quantity: selectOrderItems.quantity,
    });

    try {
      await axios.put(`https://mahmod.puretik.info/api/order/${id}`, {
        items: DataSend,
      });
      setRefresh(!refresh);
      setShowEditOrder(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setShowEditOrder(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#00000033] backdrop-blur-sm h-full"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[900px]  h-[600px] py-12 no-scrollbar  bg-[#141d2d] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center gap-3"
        >
          <h1 className="text-2xl text-white">Edit Order </h1>

          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="w-full h-full flex flex-col justify-center  px-3  gap-4 items-center ">
            <div className="flex  text-white w-full   justify-center  items-center gap-3">
              <div className="flex text-white w-full flex-col justify-center items-center gap-3">
                <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-[90%]  gap-2"
                >
                  order Quantaty :
                  <ConfigProvider
                    className="w-full   flex items-center justify-center"
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        border: "1px solid #ffffff4e",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                      min={1}
                      max={availableStokes}
                      value={selectOrderItems?.quantity} // هنا استبدلنا defaultValue بـ value
                      onChange={(e) => {
                        if (e > availableStokes) {
                          alert("the stock is not enough");
                          return;
                        }

                        setSelectOrderItems({
                          ...selectOrderItems,
                          quantity: e,
                        });
                      }}
                    />
                  </ConfigProvider>
                </label>
                <h1 className="w-[90%] text-[#a4a4a4]">Select New Color:</h1>
                <div className=" h-[50px] gap-3 flex items-center justify-center px-4 border border-[#ffffff4e] rounded-[8px] w-[90%]">
                  {itemsDetailes?.productsDetails?.options[0].color?.map(
                    (o, i) => (
                      <div
                        onClick={() => {
                          setSelectOrderItems({
                            ...selectOrderItems,
                            color: o,
                          });
                        }}
                        style={{
                          boxShadow: `${
                            selectOrderItems.color === o ? "0 0 10px #fff" : ""
                          }`,
                          backgroundColor: `${o}`,
                        }}
                        key={i}
                        className={`w-[30px] h-[30px] border cursor-pointer border-[#fff] rounded-full `}
                      ></div>
                    )
                  )}
                </div>

                <h1 className="w-[90%] text-[#a4a4a4]">Select New Size:</h1>
                <div className=" h-[50px] border gap-3 border-[#ffffff4e] rounded-[8px] flex items-center justify-center w-[90%]">
                  {itemsDetailes?.productsDetails?.options[0].size?.map(
                    (o, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setSelectOrderItems({ ...selectOrderItems, size: o });
                        }}
                        style={{
                          boxShadow: `${
                            selectOrderItems.size === o ? "0 0 10px #fff" : ""
                          }`,
                        }}
                        className={`w-[30px] cursor-pointer h-[30px] rounded-[8px] border flex justify-center items-center border-[#ffffff74]`}
                      >
                        {o === "" ? "no size" : o}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                updateOrderDetails();
              }}
              className="bg-[#F2F2F2]  hover:bg-[#f2f2f2dd] h-[50px] w-[90%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOrder;
