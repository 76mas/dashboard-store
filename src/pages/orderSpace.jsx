import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Space, Select, Button, ConfigProvider, theme } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Container from "@/components/container";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { IoAlertCircleOutline } from "react-icons/io5";
import { GrRedo } from "react-icons/gr";

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

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [search, setSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showDeleteItem, setShowDeleteItem] = useState(false);
  const [deleteitems, setDeleteitems] = useState({ id: null, name: null });
  const navigate = useNavigate();

  // جلب الطلبات
  const getOrders = async () => {
    try {
      const res = await axios.get("https://161.97.169.6:4000/order");
      const data = res.data;

      setOrders(data);

      // جلب أسماء المستخدمين حسب user_id
      data.forEach(async (order) => {
        if (!users[order.user_id]) {
          try {
            const userRes = await axios.get(
              `https://161.97.169.6:4000/user/${order.user_id}`
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

  // تحديث حالة الطلب
  const updateOrderStatus = async (status, id) => {
    try {
      await axios.put(`https://161.97.169.6:4000/order/${id}`, { status });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  // التصفية حسب الاسم
  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) =>
        users[order.user_id]
          ? users[order.user_id].toLowerCase().includes(search.toLowerCase())
          : false
      )
    );
  }, [orders, users, search]);

  // تحميل البيانات
  useEffect(() => {
    getOrders();
  }, [refresh]);

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التوصيل";
      default:
        return "ملغاة";
    }
  };

  // أعمدة الجدول
  const columns = [
    {
      title: "الطلب ",
      render: (_, __, index) => `#${index + 1}`,
    },
    {
      title: "العميل",
      dataIndex: "user_id",
      render: (user_id) => users[user_id] || "Loading...",
    },
    {
      title: "العنوان",
      dataIndex: "address",
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "delivered"
            ? "green"
            : status === "pending"
            ? "gold"
            : status === "shipped"
            ? "blue"
            : "red";
        return <Tag color={color}>{translateStatus(status)}</Tag>;
      },
    },
    {
      title: "التاريخ",
      dataIndex: "created_at",
      render: (date) => (date ? date.split("T")[0] : ""),
    },
    {
      title: "العناصر",
      dataIndex: "items",
      render: (items) =>
        items?.map((p, i) => (
          <div key={i} className="text-sm text-white/80">
            {p.product_info?.name || "Unknown"} (x{p.quantity})
          </div>
        )),
    },
    {
      title: "الإجمالي",
      render: (_, record) => {
        if (record?.voucher_info?.value) {
          return (
            <div className="flex flex-col">
              <span className="text-red-400 line-through">
                ${formatWithCommas(FinalRealPrice(record))}
              </span>
              <span className="text-green-400">
                {formatWithCommas(FinalRealPrice(record) - VoucherType(record))}
              </span>
            </div>
          );
        }

        return (
          <span className="text-green-400">
            ${formatWithCommas(FinalRealPrice(record))}
          </span>
        );
      },
    },
    {
      title: "الإجراءات",
      render: (_, record) => (
        <Space wrap>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => updateOrderStatus(value, record.id)}
            options={[
              { value: "cancelled", label: "ملغاة" },
              { value: "delivered", label: "تم التوصيل" },
              { value: "shipped", label: "تم الشحن" },
              { value: "pending", label: "قيد الانتظار" },
            ]}
          />

          <Button
            danger
            onClick={() => {
              setDeleteitems({ id: record.id, name: "order" });
              setShowDeleteItem(true);
            }}
          >
            <MdOutlineDelete />
          </Button>

          <Button onClick={() => navigate(`/editOrder/${record.id}`)}>
            <FaRegEdit />
          </Button>
        </Space>
      ),
    },
  ];

  const VoucherType = (order) => {
    if (order.voucher_info?.type === "per") {
      return Math.min(
        order.voucher_info?.max_value,
        (Number(order.voucher_info?.value) / 100) * FinalRealPrice(order)
      );
    } else {
      return order.voucher_info?.value;
    }
  };

  const FinalRealPrice = (order) => {
    let tolal = 0;
    let TimeOfOrderCreate = order.created_at;
    let items = order.items;

    items.forEach((p) => {
      if (TimeOfOrderCreate <= p.product_info?.endpricedate) {
        tolal += (p.product_info?.endprice || 0) * p.quantity;
      } else {
        tolal += (p.product_info?.price || 0) * p.quantity;
      }
    });

    return tolal;
  };

  return (
    <div className="w-full p-4 h-full flex items-center flex-col">
      {/* حقل البحث */}
      <Container>
        <div className="w-full h-full p-3 flex justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
          <div className="flex items-center w-[400px] relative">
            <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="ابحث عن اسم العميل..."
              className="pl-10 pr-4 py-2 rounded-md w-full bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
            />
          </div>
        </div>
      </Container>

      {/* الجدول */}
      <Container>
        <AnimatePresence>
          <motion.div
            key="alert-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full mt-3 flex justify-center"
          >
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredOrders}
                pagination={{ pageSize: 6 }}
                className="w-full"
              />
            </ConfigProvider>
          </motion.div>
        </AnimatePresence>
      </Container>

      {showDeleteItem && (
        <AlertDelete
          setShowDeleteItem={setShowDeleteItem}
          deleteitems={deleteitems}
          setDeleteitems={setDeleteitems}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default OrdersTable;

const AlertDelete = ({
  setShowDeleteItem,
  deleteitems,
  setDeleteitems,
  refresh,
  setRefresh,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://161.97.169.6:4000/${deleteitems.name}/${deleteitems.id}`
      );
      setShowDeleteItem(false);
      setDeleteitems({ id: null, name: null });
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => {
        setShowDeleteItem(false);
      }}
      className="w-full z-40 -mt-24 fixed flex items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="alert-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[400px] h-[200px] bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <IoAlertCircleOutline className="text-[30px] text-[#ff0073cc]" />

          <h1 dir="rtl" className="text-[#ddd] text-center">
            هل أنت متأكد من حذف هذا العنصر؟
          </h1>

          <div className="flex items-center gap-3 w-[85%]">
            <button
              onClick={handleDelete}
              className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#ff00731c] transition-all duration-200"
            >
              حذف <MdDeleteOutline />
            </button>

            <button
              onClick={() => setShowDeleteItem(false)}
              className="w-full py-2 cursor-pointer text-sky-800 border-2 border-sky-800 flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#1e90ff22] transition-all duration-200"
            >
              الغاء <GrRedo />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
