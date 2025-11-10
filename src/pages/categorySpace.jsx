import React, { useEffect, useState } from "react";
import { Table, Space, Button, ConfigProvider, theme, Switch, Tag } from "antd";
import { MdDeleteOutline, MdOutlineDone } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import Container from "@/components/container";
import axios from "axios";
import { useStatment } from "../context/maping";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import AlertDelete from "@/components/alertDelete";
import EditCategory from "@/components/editCategory";
import AddCategory from "@/components/addCategory";
const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  // const { setShowAddCategory } = useStatment();
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  // const { setShowAlert, setDeleteitems, setCategoryId, setShowEditCategory } =
  //   useStatment();
  const [showAlert, setShowAlert] = useState(false);
  const [deleteitems, setDeleteitems] = useState({ id: null, name: null });
  const [refresh, setRefresh] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    GetCategories();
    GetProducts();
  }, [refresh]);

  const GetCategories = async () => {
    try {
      const res = await axios.get("https://mahmod.puretik.info/api/category");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const GetProducts = async () => {
    try {
      const res = await axios.get("https://mahmod.puretik.info/api/product", {
        params: { page: 1, limit: 1000 }, // أو بدون pagination إذا تحتاج كل المنتجات
      });
      // ✅ إذا الباك إند يرجّع { products, total }
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProductCount = (categoryId) => {
    return products.filter((product) => product.category_id === categoryId)
      .length;
  };

  const columns = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "الأولوية",
      dataIndex: "priority",
      key: "priority",
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
      title: "عدد المنتجات",
      key: "productsCount",
      render: (_, record) => <span>{getProductCount(record.id)}</span>,
    },
    {
      title: "الإجراءات",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setShowEditCategory(true);
              setCategoryId(record.id);
            }}
            type="primary"
            icon={<CiEdit />}
          >
            تعديل
          </Button>
          <Button
            danger
            onClick={() => {
              setDeleteitems({ id: record.id, name: "category" });
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

  const filterData = categories.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  const handelChangeActive = async (id, newActive) => {
    console.log("click", id, newActive);
    try {
      await axios.put(`https://mahmod.puretik.info/api/category/${id}`, {
        active: newActive,
      });
      // getAllProducts();
      GetCategories();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (showAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showAlert]);
  useEffect(() => {
    if (showEditCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showEditCategory]);

  useEffect(() => {
    if (showAddCategory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showAddCategory]);

  return (
    <>
      <div className="w-full  flex flex-col  h-full items-center">
        <div className="w-full  flex justify-center mt-5 h-[70px]">
          <Container>
            <div className="w-full h-full flex items-center flex-col">
              <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
                <button
                  onClick={() => {
                    setShowAddCategory(true);
                  }}
                  className="bg-[#F2F2F2] cursor-pointer px-4 py-2 rounded-md"
                >
                  إضافة فئة
                </button>

                <diV className="flex items-center w-[400px] relative">
                  <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="بحث..."
                    className="pl-10 pr-4 py-2 rounded-md w-full bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </diV>
              </div>
            </div>
          </Container>
        </div>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
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
              <Container>
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={filterData}
                  className="w-full"
                />
              </Container>
            </motion.div>
          </AnimatePresence>
        </ConfigProvider>

        {showAlert && (
          <AlertDelete
            setShowAlert={setShowAlert}
            deleteitems={deleteitems}
            setDeleteitems={setDeleteitems}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
      </div>
      {showAddCategory && (
        <AddCategory
          setShowAddCategory={setShowAddCategory}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {showEditCategory && (
        <EditCategory
          setShowEditCategory={setShowEditCategory}
          refresh={refresh}
          setRefresh={setRefresh}
          id={categoryId}
        />
      )}
    </>
  );
};

export default CategoryTable;
