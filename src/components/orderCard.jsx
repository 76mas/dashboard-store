import axios from "axios";
import { useEffect, useState } from "react";
import Container from "./container";
import { useStatment } from "../context/maping";
import { MdOutlineDelete } from "react-icons/md";
import { Select, Space, Button, ConfigProvider, theme, Tag } from "antd";
const OrderCard = ({ orders }) => {

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});

  const {
    setShowAlert,
refresh, setRefresh,
    setDeleteitems,
  } = useStatment();

  useEffect(() => {
    getProducts();
    GetOrders();
  }, [refresh]);

  const GetOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/order`);
      //   setOrders(res.data);

      res.data.forEach(async (order) => {
        if (!users[order.user_id]) {
          try {
            const userRes = await axios.get(
              `http://localhost:4000/user/${order.user_id}`
            );
            setUsers((prev) => ({
              ...prev,
              [order.user_id]: userRes.data.name,
            }));
          } catch (err) {
            console.log(err);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/product`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const OrderStatus = async (status, id) => {
    try {
      const res = await axios.put(`http://localhost:4000/order/${id}`, {
        status: status,
      });
      setRefresh(!refresh);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //    let color =(status) =>(
  //           status === "delivered"
  //             ? "green"
  //             : status === "pending"
  //             ? "gold"
  //             : status === "shipped"
  //             ? "blue"
  //             : "red";)

  const DeleteOrder = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/order/${id}`);
      console.log(res.data);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };
  const OrdersGrid = ({ order }) => {
    return order.map((item, index) => (
      <div
        key={index}
        className="w-[1fr] border  border-[#ffffff4e] backdrop-blur-2xl overflow-hidden h-[800px] rounded-2xl bg-[#ffffff19] flex flex-col gap-3 items-center"
      >
        <div className="w-full  flex border-b  border-[#ffffff4e] h-[80px] backdrop-blur-2xl bg-[#282828b4] p-4  justify-between gap-3 items-center">
          <div className="w-[100px] text-[#fff] h-full">
            <div className="flex flex-col justify-center items-center">
              <h1 className="">Orders #{index + 1}</h1>
              <h1 className="">{item.created_at.split("T")[0]}</h1>
            </div>
          </div>
          <div
     
          >
            <h1>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                }}
              >
                <Tag
                  color={
                    item.status === "delivered"
                      ? "green"
                      : item.status === "pending"
                      ? "gold"
                      : item.status === "shipped"
                      ? "blue"
                      : "red"
                  }
                >
                  {item.status.toUpperCase()}
                </Tag>
              </ConfigProvider>
            </h1>
          </div>
        </div>

        <div className="w-full p-4 flex items-center justify-center h-[120px]  mt-3 border-t border-b border-[#ffffff4e] backdrop-blur-2xl bg-[#282828b4] ">
          <div className="w-full h-full  flex justify-center flex-col items-start">
            <div className="text-white">
              Client :{" "}
              <span className="text-amber-600">
                {users[item.user_id] || "Loading..."}
              </span>
            </div>
            <div className="text-white">
              Address :<span className="text-amber-600">{item.address}</span>
            </div>
            <div className="text-white">
              Phone : <span className="text-amber-600">{item.phone}</span>
            </div>
          </div>
        </div>

        <h1 className="w-full text-start px-4 text-white text-2xl">Products</h1>

        <div className="w-[95%] relative  p-4 gap-1 flex-col flex items-center justify-center h-full overflow-y-scroll no-scrollbar   mt-3 border border-[#ffffff4e] rounded-2xl backdrop-blur-2xl bg-[#282828b4] ">
          <div className="fixed p-3 rounded-3xl text-[13px] text-[#fff]  top-4 right-4 flex items-center justify-center bg-green-600 h-[30px]">
            <h1>Total Price: 300$</h1>
          </div>

          {Array.isArray(item.items) && item.items.map((product, pIndex) => (
            <div
              key={pIndex}
              className="w-full h-[100px] p-3 flex items-center justify-between border border-[#ffffff4e] rounded-2xl bg-[#282828b4]"
            >
              <div className="flex items-center text-[13px] gap-1">
                <div className="flex overflow-hidden  w-[70px] rounded-2xl h-[70px]">
                  <img
                    className="w-full"
                    src={
                      products.find((i) => i.id === product.id)?.images?.[0]
                        ?.link
                        ? `http://localhost:4000/${
                            products.find((i) => i.id === product.id).images[0]
                              .link
                          }`
                        : ""
                    }
                    alt="img"
                  />
                </div>

                <div className="flex gap-2 text-white flex-col ml-3">
                  <div className="text-white/70">
                    Product Name:{" "}
                    <span className="text-white">
                      {products.find((i) => i.id === product.id)?.name}
                    </span>
                  </div>
                  <div className="text-white/70">
                    Price:{" "}
                    <span className="text-white">
                      {products.find((i) => i.id === product.id)?.price}
                    </span>
                  </div>
                  <div className="flex gap-3  text-white/70 items-center">
                    {product.color && (
                      <div className="flex gap-1 items-center ">
                        <h1 className="flex">Color:</h1>
                        <div
                          style={{
                            backgroundColor: product.color,
                          }}
                          className={`flex justify-center items-center rounded-3xl bg-[$${product.color}] p-2`}
                        ></div>
                      </div>
                    )}

                    {product.size && (
                      <div className="flex gap-1 items-center ">
                        <h1>Size:</h1>
                        <div className="flex  ">{product.size}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center bg-[#0101016a] p-2 rounded-2xl ">
                <p className="text-[12px] text-white">
                  Quantity: {product.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-[150px] p-3 flex items-center justify-between border-t  border-[#ffffff4e] backdrop-blur-2xl bg-[#282828b4]">
          <div className="w-full px-4  flex justify-between items-center">
            <div className="flex text-white w-full p-3 items-center gap-3">
              <h1>
                Delevery Cost :{" "}
                <span
                  className={` ${
                    item.delivary_cost === 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {" "}
                  {item.delivary_cost === 0 ? "Free" : item.delivary_cost}
                </span>
              </h1>
            </div>
            <div className="flex w-full p-3 justify-end items-center gap-3">
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                }}
              >
                <Space wrap>
                  <Select
                    defaultValue={item.status}
                    style={{ width: 120 }}
                    onChange={(value) => OrderStatus(value, item.id)}
                    options={[
                      { value: "cancelled", label: "cancelled" },
                      { value: "delivered", label: "delivered" },
                      { value: "shipped", label: "shipped" },
                      { value: "pending", label: "pending" },
                    ]}
                  />

                  <Button
                    type="primary"
                    danger
                    onClick={() => {
                      setShowAlert(true);
                      setDeleteitems({ id: item.id, name: "order" });
                    }}
                    icon={<MdOutlineDelete />}
                  />
                </Space>
              </ConfigProvider>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="w-full   h-full flex flex-col items-center">
        <Container>
          <div className="w-full h-full mt-6 grid grid-cols-2 gap-3">
            {orders.length > 0 && <OrdersGrid order={orders} />}
          </div>
        </Container>
      </div>
    </>
  );
};

export default OrderCard;
