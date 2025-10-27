import { Table, Space, Button, ConfigProvider, theme, Tag, Switch } from "antd";
import { MdDeleteOutline, MdOutlineDone } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

import { useStatment } from "../context/maping";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import AlertDelete from "./alertDelete";
import EditProduct from "./editProduct";

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

const ProductsTable = ({
  products,
  refresh,
  setRefresh,
  total,
  page,
  limit,
  setPage,
}) => {
  const [productDetails, setProductDetails] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [deleteitems, setDeleteitems] = useState({ id: null, name: null });

  const [showEditProduct, setEditShowProduct] = useState(false);

  const handelChangeActive = async (id, newActive) => {
    try {
      await axios.put(`http://161.97.169.6:4000/product/${id}`, {
        active: newActive,
      });
      // getAllProducts();
      setRefresh(!refresh);
    } catch (e) {
      console.log(e);
    }
  };
  const columns = [
    {
      title: "الصورة",
      key: "image",
      render: (_, record) => (
        <div className="w-[50px] h-[50px] rounded-md overflow-hidden flex items-center justify-center">
          <img
            src={`${record.images[0]?.link}`}
            // src={
            //   record.images[0]?.link.includes("https")
            //     ? `${record.images[0]?.link}`
            //     : `http://localhost:4000/${record.images[0]?.link}`
            // }
            alt={record.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span className="text-green-500">${formatWithCommas(price)}</span>
      ), // <span className="text-green-500">${price}</span>,
    },
    {
      title: "المخزون",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <span
          className={`${
            stock > 10
              ? "text-green-500"
              : stock > 0
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {stock} in stock
        </span>
      ),
    },

    {
      title: "الحالة",
      dataIndex: "active",
      key: "active",
      render: (active) => (
        <Space
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tag
            style={{
              width: "90px",
              textAlign: "center",
            }}
            color={active ? "green" : "red"}
          >
            {active ? "فعال" : "غير فعال"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "تاريخ الإضافة",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => date.split("T")[0],
    },
    {
      title: "الإجراءات",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setProductDetails(record);
              setEditShowProduct(true);
            }}
            type="primary"
            icon={<CiEdit />}
          >
            تعديل
          </Button>
          <Button
            danger
            onClick={() => {
              setDeleteitems({ id: record.id, name: "product" });
              setShowAlert(true);
            }}
            icon={<MdDeleteOutline />}
          >
            حذف
          </Button>

          <Switch
            // loading={loadingRows[record.id]}
            checked={record.active}
            onChange={(checked) => handelChangeActive(record.id, checked)}
            style={{
              background: record.active ? "green" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            checkedChildren={<MdOutlineDone size={20} />}
            unCheckedChildren={<IoClose size={20} />}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (showAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showAlert]);
  useEffect(() => {
    if (showEditProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditProduct]);
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <div className="w-full  flex justify-center">
          {/* <Table
            rowKey="id"
            columns={columns}
            dataSource={products}
            className="w-full"
          /> */}

          <Table
            rowKey="id"
            columns={columns}
            dataSource={products}
            pagination={{
              current: page,
              pageSize: limit,
              total: total,
              onChange: (newPage) => {
                setPage(newPage);
                console.log(newPage);
              },
            }}
            className="w-full"
          />
        </div>
        {showAlert && (
          <AlertDelete
            setShowAlert={setShowAlert}
            deleteitems={deleteitems}
            setDeleteitems={setDeleteitems}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
        {showEditProduct && (
          <EditProduct
            productDetails={productDetails}
            setEditShowProduct={setEditShowProduct}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
      </ConfigProvider>
    </>
  );
};

export default ProductsTable;
