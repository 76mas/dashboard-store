import axios from "axios";
import { use, useEffect, useState } from "react";
import Container from "./container";
import { FiSearch } from "react-icons/fi";
import { useStatment } from "../context/maping";
import OrderCard from "./orderCard";
import { useNavigate } from "react-router-dom";
// import OrdersTable from "./orderTable";
import { AnimatePresence, motion } from "framer-motion";

const OrderSpace = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  // const { refresh, setRefresh } = useState();
  const {

    refresh,
    setRefresh,
  } = useStatment();

  const [View, setView] = useState({
    table: true,
    view: false,
  });
  useEffect(() => {
    getProducts();
    GetOrders();
  }, [refresh]);

  const GetOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/order`);
      setOrders(res.data);

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

  const DeleteOrder = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:4000/order/${id}`);
      console.log(res.data);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  // const filteredOrders = orders.filter((order) =>
  //   users[order.user_id]
  //     ? users[order.user_id].toLowerCase().includes(search.toLowerCase())
  //     : false
  // );

  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        users[order.user_id]
          ? users[order.user_id].toLowerCase().includes(search.toLowerCase())
          : false
      )
    );
  },[])


  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        users[order.user_id]
          ? users[order.user_id].toLowerCase().includes(search.toLowerCase())
          : false
      )
    );
  }, [refresh, search, orders, users]);

  return (
    <>
      <div className="w-full   h-full flex flex-col items-center">
        <div className="w-full  flex justify-center mt-5 h-[70px]">
          <Container>
            <div className="w-full h-full flex items-center flex-col">
              <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
                <div className="flex gap-1   h-full py-3  text-white items-center ">
                  <button
                    onClick={() => {
                      setView({
                        table: false,
                        view: true,
                      });
                    }}
                    className={` ${
                      View.view
                        ? "bg-[#F2F2F2] text-[#000]"
                        : "hover:bg-[#f2f2f223]"
                    }  cursor-pointer px-4 py-2 rounded-md`}
                  >
                    View
                  </button>

                  <button
                    onClick={() => {
                      setView({
                        table: true,
                        view: false,
                      });
                    }}
                    className={` ${
                      View.table
                        ? "bg-[#F2F2F2] text-[#000]"
                        : "hover:bg-[#f2f2f223]"
                    }  cursor-pointer px-4 py-2 rounded-md`}
                  >
                    Table
                  </button>
                </div>

                <div className="flex items-center text-[#000] gap-4">
                  <diV className="flex items-center relative">
                    <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                    <input
                      type="text"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Order..."
                      className="pl-10 pr-4 py-2 rounded-md w-[400px] bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                    />
                  </diV>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {orders.length > 0 && View.view ? (
          <OrderCard orders={filteredOrders} />
        ) : orders.length > 0 && View.table ? (
          <AnimatePresence>
            <motion.div
              key="alert-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full mt-6 flex justify-center"
            >
              <OrdersTable
                orders={orders}
                refresh={refresh}
                setRefresh={setRefresh}
                filteredOrders={filteredOrders}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default OrderSpace;



///******************************************************************************** */



// import { navigate } from "react-router-dom";
const OrdersTable = ({ filteredOrders, refresh, setRefresh }) => {
  console.log(filteredOrders);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const navgation = useNavigate();

  // const [refreshOrders, setRefreshOrders] = useState(false);

  const {
    // refresh,
    // setRefresh,
    setShowAlert, // [deleteItem]
    setDeleteitems, // [deleteItem]
  } = useStatment();

  useEffect(() => {
    getProducts();
    GetOrders();
  }, []);

  const GetOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/order`);
      // setOrders(res.data);

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
      await axios.put(`http://localhost:4000/order/${id}`, {
        status: status,
      });
      // setRefresh(!refresh);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/order/${id}`);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id, record, index) => `#${index + 1}`,
    },
    {
      title: "Client",
      dataIndex: "user_id",
      key: "user_id",
      render: (user_id) => users[user_id] || "Loading...",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "delivered"
            ? "green"
            : status === "pending"
            ? "gold"
            : status === "shipped"
            ? "blue"
            : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => date.split("T")[0],
    },
    {
      title: "Products",
      dataIndex: "items",
      key: "items",
      render: (items) =>
        items.map((p, i) => {
          const prod = products.find((x) => x.id === p.id);
          return (
            <div key={i} className="text-sm text-white/80">
              {prod?.name} (x{p.quantity})
            </div>
          );
        }),
    },
    {
      title: "Total Price",
      key: "total",
      render: (_, record) => {
        console.log("record", record);

        let total = 0;
        record.items.forEach((p) => {
          const prod = products.find((x) => x.id === p.id);
          total += (prod?.price || 0) * p.quantity;
        });

        if (record?.voucher_info?.value) {
          return (
            <div className="flex flex-col">
              <span className="text-red-400 line-through">${total}</span>
              <span className="text-green-400">
                ${total - record?.voucher_info?.value}
              </span>
            </div>
          );
        }
        return <span className="text-green-400">${total}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space wrap>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => OrderStatus(value, record.id)}
            options={[
              { value: "cancelled", label: "cancelled" },
              { value: "delivered", label: "delivered" },
              { value: "shipped", label: "shipped" },
              { value: "pending", label: "pending" },
            ]}
          />

          <Button
            danger
            onClick={() => {
              setShowAlert(true);
              setDeleteitems({ id: record.id, name: "order" });
            }}
            icon={<MdOutlineDelete />}
          />

          <Button
            onClick={() => {
              navgation(`/editOrder/${record.id}`);
            }}
            icon={<FaRegEdit />}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        {/* <div className="w-full mt-6 flex flex-col items-center"> */}
        <Container>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredOrders}
            className="w-full"
          />
        </Container>
        {/* </div> */}
      </ConfigProvider>
    </>
  );
};


