import { useParams } from "react-router-dom";
import Container from "@/components/container";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import EditOrder from "@/components/editOrder";
import {
  FaRegEdit,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBox,
  FaDollarSign,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import {
  Table,
  Select,
  Space,
  Button,
  ConfigProvider,
  theme,
  Tag,
  Card,
  Avatar,
  Divider,
} from "antd";

import EdtUserOrderInfo from "../components/edtUserOrderInfo";
import DeleteItem from "../components/deleteitemfromOrder";
import AddProductToOrder from "@/components/addProductToOrder";

const TotalpriceforOneProduct = (product, quantity) => {
  if (product?.product_info?.endpricedate <= product?.created_at) {
    return (product?.product_info?.price || 0) * quantity;
  } else {
    return (product?.product_info?.endprice || 0) * quantity;
  }
};

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
const EditOrderPage = () => {
  const { id } = useParams();

  const [showDeleteItem, setShowDeleteItem] = useState(false);
  const [showEditOrderUserInfo, setShowEditOrderUserInfo] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [showAddProductToOrder, setShowAddProductToOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    GetOrders({ id });
  }, [id]);

  useEffect(() => {
    GetOrders({ id });
  }, [refresh]);

  const GetOrders = async ({ id }) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://161.97.169.6:4000/order/${id}`);
      setOrders(res.data);

      try {
        let p = [];
        for (let i = 0; i < res.data.items.length; i++) {
          const product = await axios.get(
            `http://161.97.169.6:4000/product/${res.data.items[i].id}`
          );
          p.push(product.data);
        }
        setProducts(p);
      } catch (err) {
        console.log(err);
      }

      try {
        const userRes = await axios.get(
          `http://161.97.169.6:4000/user/${res.data.user_id}`
        );
        setUserInfo(userRes.data);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOrderData({ OrderDetails: orders?.items, productsDetails: products });
  }, [orders, products]);

  const ProductPrice = (product) => {
    // if (product?.product_info?.endpricedate <= product?.created_at) {
    //   return product.price;
    // }

    if (product?.endpricedate >= product?.created_at) {
      return product?.endprice;
    } else {
      return product?.price;
    }
  };

  const calculateTotal = () => {
    let tolal = 0;
    // let order= orderData?.OrderDetails || [];

    let TimeOfOrderCreate = orders?.created_at || [];
    let items = orders?.items || [];

    items.forEach((p) => {
      if (TimeOfOrderCreate <= p.product_info?.endpricedate) {
        tolal += (p.product_info?.endprice || 0) * p.quantity;
      } else {
        tolal += (p.product_info?.price || 0) * p.quantity;
      }
    });

    return tolal;
  };

  const VoucherType = (order) => {
    if (order.voucher_info?.type === "per") {
      return Math.min(
        order.voucher_info?.max_value,
        (Number(order.voucher_info?.value) / 100) * calculateTotal()
      );
    } else {
      return order.voucher_info?.value;
    }
  };

  const OrderDetails = ({ orderData }) => {
    const orderDetails = orderData?.OrderDetails ?? [];
    const productsDetails = orderData?.productsDetails ?? [];
    setOrderDetails(orderData);

    const dataSource = orderDetails.map((item) => {
      const product = productsDetails.find((p) => p.id === item.id);
      const price = orders?.items?.find((p) => p.id === item.id) || null;
      return {
        key: item.id,
        name: product?.name || "Unknown",
        image: product?.images?.[0]?.link || null,
        price: price?.product_info.price || 0,
        color: item.color,
        size: item.size || "-",
        quantity: item.quantity,
        total: TotalpriceforOneProduct(price, item.quantity),
        created_at: orders.created_at,
        endpricedate: product?.endpricedate,
        endprice: price?.product_info.endprice || 0,
      };
    });

    const columns = [
      {
        title: "Product",
        key: "product",
        render: (_, record) => (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center">
              {record.image ? (
                <img
                  src={`${record.image}`}
                  alt="product"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaBox className="text-gray-500 text-xl" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white">{record.name}</span>
              <span className="text-sm text-gray-400">SKU: #{record.key}</span>
            </div>
          </div>
        ),
      },
      {
        title: "السعر",
        dataIndex: "price",
        key: "price",
        render: (_, record) => (
          <span className="font-semibold text-green-400">
            ${formatWithCommas(ProductPrice(record))}
          </span>
        ),
      },
      {
        title: "المواصفات",
        key: "specs",
        render: (_, record) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">اللون:</span>
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: record.color }}
                title={record.color}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">الحجم:</span>
              <Tag color="blue">{record.size}</Tag>
            </div>
          </div>
        ),
      },
      {
        title: "الكمية",
        dataIndex: "quantity",
        key: "quantity",
        render: (quantity) => (
          <Tag color="cyan" className="text-lg font-bold">
            {quantity}
          </Tag>
        ),
      },
      {
        title: "المجموع",
        dataIndex: "total",
        key: "total",
        render: (total) => (
          <span className="font-bold text-lg text-green-400">
            ${formatWithCommas(total)}
          </span>
        ),
      },
      {
        title: "الإجراء",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="primary"
              icon={<FaRegEdit />}
              onClick={() => {
                setOrderId(record.key);

                setShowEditOrder(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 border-none"
            >
              تعديل
            </Button>
            <Button
              danger
              icon={<MdOutlineDelete />}
              onClick={() => {
                setOrderId(record.key);
                setShowDeleteItem(true);
              }}
              className="bg-red-600 hover:bg-red-700 border-none"
            >
              حذف
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 flex-row flex items-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaBox className="text-blue-400" />
            تفاصيل الطلب
          </h2>

          <button
            onClick={() => {
              setShowAddProductToOrder(true);
            }}
            className="absolute top-6 right-6 bg-gradient-to-r from-green-600/90 active:scale-95 to-cyan-600/80 p-2 rounded-sm text-white hover:bg-gradient-to-r hover:text-white/80  cursor-pointer transition flex items-center gap-2"
          >
            اضف منتج <FaPlus />
          </button>
        </div>
        <div className="p-6">
          <Table
            className="custom-table"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            loading={loading}
            locale={{ emptyText: "No products available" }}
          />

          {/* Order Total */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">
                السعر الإجمالي للطلب:
              </span>

              <div className="flex items-end gap-2 flex-col">
                <span
                  style={{
                    color: orders?.voucher_info ? "red" : "#05df72",
                    textDecoration: orders?.voucher_info
                      ? "line-through"
                      : "none",
                  }}
                  className="text-2xl font-bold  "
                >
                  ${formatWithCommas(calculateTotal())}
                </span>
                {orders?.voucher_info?.value && (
                  <span className="text-2xl font-bold flex items-center text-green-400">
                    <span
                      dir="rtl"
                      className="text-white/70 font-[100] text-[14px]"
                    >
                      {" "}
                      (خصم القسيمة:{" "}
                      <span className="text-red-400">
                        {formatWithCommas(
                          calculateTotal() -
                            (calculateTotal() - VoucherType(orders))
                        )}
                        $-
                      </span>
                      )
                    </span>
                    ${formatWithCommas(calculateTotal() - VoucherType(orders))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
  const CustomerInfo = () => (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden h-fit">
      <div className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <FaUser className="text-purple-400" />
          معلومات العميل
        </h2>
      </div>
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
              <Avatar
                size={50}
                icon={<FaUser />}
                className="bg-gradient-to-r from-blue-500 to-purple-500"
              />
              <div>
                <p className="text-lg font-semibold text-white">
                  {userInfo.name || "Not specified"}
                </p>
                <p className="text-sm text-gray-400">العميل</p>
              </div>
            </div>

            <Divider className="border-gray-700" />

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30">
                <FaPhone className="text-green-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-400">رقم الجوال</p>
                  <p className="text-white font-medium">
                    {orders?.phone || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-800/30">
                <FaMapMarkerAlt className="text-red-400 text-lg mt-1" />
                <div>
                  <p className="text-sm text-gray-400">العنوان</p>
                  <p className="text-white font-medium leading-relaxed">
                    {orders?.address || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30">
                <FaDollarSign className="text-yellow-400 text-lg" />
                <div>
                  <p className="text-sm text-gray-400">حالة الطلب</p>
                  <Tag
                    color={
                      orders?.status === "delivered"
                        ? "green"
                        : orders?.status === "pending"
                        ? "gold"
                        : orders?.status === "shipped"
                        ? "blue"
                        : "red"
                    }
                  >
                    {/* {orders?.status} */}
                    {translateStatus(orders?.status)}
                  </Tag>
                </div>
              </div>

              <Button
                onClick={() => {
                  setOrderId(orders.id);
                  setShowEditOrderUserInfo(true);
                }}
                className="w-full"
                type="primary"
              >
                <FaRegEdit className="mr-2" />
                تعديل معلومات العميل
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        .custom-table .ant-table {
          background: transparent !important;
        }
        .custom-table .ant-table-thead > tr > th {
          background: rgba(55, 65, 81, 0.5) !important;
          color: white !important;
          border-bottom: 1px solid #374151 !important;
          font-weight: 600;
        }
        .custom-table .ant-table-tbody > tr > td {
          background: transparent !important;
          border-bottom: 1px solid rgba(55, 65, 81, 0.3) !important;
          color: white !important;
        }
        .custom-table .ant-table-tbody > tr:hover > td {
          background: rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>

      <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {showEditOrder && (
          <EditOrder
            refresh={refresh}
            setRefresh={setRefresh}
            orderDetails={orderData}
            setShowEditOrder={setShowEditOrder}
            orderId={orderId}
          />
        )}
        {showAddProductToOrder && (
          <AddProductToOrder
            refresh={refresh}
            setRefresh={setRefresh}
            setShowAddProductToOrder={setShowAddProductToOrder}
          />
        )}
        {showDeleteItem && (
          <DeleteItem
            refresh={refresh}
            setRefresh={setRefresh}
            orderDetails={orderData}
            setOrderDetails={setOrderDetails}
            setShowDeleteItem={setShowDeleteItem}
            orderId={orderId}
          />
        )}
        {showEditOrderUserInfo && (
          <EdtUserOrderInfo refresh={refresh} setRefresh={setRefresh} />
        )}
        <Container>
          <div className="py-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                Edit Order #{id}
              </h1>
              <p className="text-gray-400">
                You can edit the order details and customer information from
                here
              </p>
            </div>

            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorBgContainer: "transparent",
                },
              }}
            >
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                  <OrderDetails orderData={orderData} />
                </div>

                <div className="xl:col-span-1">
                  <CustomerInfo />
                </div>
              </div>
            </ConfigProvider>
          </div>
        </Container>
      </div>
    </>
  );
};

export default EditOrderPage;
