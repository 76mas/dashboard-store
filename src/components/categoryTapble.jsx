import React, { useEffect, useState } from "react";
import { Table, Space, Button, ConfigProvider, theme } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import Container from "./container";
import axios from "axios";
import { useStatment } from "../context/maping";
import { motion , AnimatePresence } from "framer-motion";
const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const { setShowAddCategory } = useStatment();
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState([]);
  const { setShowAlert, setDeleteitems, setCategoryId, setShowEditCategory } =
    useStatment();

  useEffect(() => {
    GetCategories();
    GetProducts();
  }, []);

  const GetCategories = async () => {
    try {
      const res = await axios.get("http://localhost:4000/category");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const GetProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/product");
      setProducts(res.data);
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Products Count",
      key: "productsCount",
      render: (_, record) => <span>{getProductCount(record.id)}</span>,
    },
    {
      title: "Action",
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
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              setDeleteitems({ id: record.id, name: "category" });
              setShowAlert(true);
            }}
            icon={<MdDeleteOutline />}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filterData = categories.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });
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
                  Add Category
                </button>

                <diV className="flex items-center w-[400px] relative">
                  <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder="Search Category..."
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
      </div>
    </>
  );
};

export default CategoryTable;
