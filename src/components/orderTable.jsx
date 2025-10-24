import axios from "axios";
import { useEffect, useState } from "react";
import Container from "./container";
import { FiSearch } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Table, Select, Space, Button, ConfigProvider, theme, Tag } from "antd";
// import { useStatment } from "../context/maping";

import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStatment } from "@/context/maping";
// import { navigate } from "react-router-dom";

function formatWithCommas(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).trim();
  // إذا كان فيه جزء عشري
  const [intPart, decPart] = s.split(".");
  // احتفظ بعلامة السالب
  const sign = intPart.startsWith("-") ? "-" : "";
  const absInt = intPart.replace("-", "");
  // نضيف الفواصل كل 3 خانات من اليمين
  const formattedInt = absInt.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return sign + formattedInt + (decPart ? "." + decPart : "");
}

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
              <span className="text-red-400 line-through">
                ${formatWithCommas(total)}
              </span>
              <span className="text-green-400">
                ${formatWithCommas(total - record?.voucher_info?.value)}
              </span>
            </div>
          );
        }
        return <span className="text-green-400">${formatWithCommas(total)}</span>;
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

export default OrdersTable;
