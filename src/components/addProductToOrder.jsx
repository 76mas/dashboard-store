import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Select, theme, ConfigProvider, InputNumber } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const AddProductToOrder = ({
  setShowAddProductToOrder,
  refresh,
  setRefresh,
}) => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [options, setOptions] = useState([]);
  const [optionSelected, setOptionSelected] = useState({
    color: null,
    size: null,
    quantity: 1,
  });

  // دالة تجيب المنتجات حسب البحث
  const fetchProducts = async (term = "") => {
    try {
      setLoading(true);
      const response = await axios.get("http://161.97.169.6:4000/product", {
        params: { limit: 10, search: term },
      });
      if (response.data?.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchProducts(value);
  };

  const handleSelect = (value) => {
    const selected = products.find((p) => p.id === value);
    setSelectedProduct(selected);
    setOptions(selected ? selected.options[0] || [] : []);
    setOptionSelected({ color: null, size: null, quantity: 1 });
  };

  const handelAdd = async () => {
    const haveColor = options.color?.length > 0;
    const haveSize = options.size?.length > 0;

    if (haveColor && optionSelected.color === null) {
      alert("Please select color");
      return;
    }

    if (haveSize && optionSelected.size === null) {
      alert("Please select size");
      return;
    }

    try {
      const response = await axios.get(`http://161.97.169.6:4000/order/${id}`);
      const currentOrder = response.data;

      if (!currentOrder) {
        alert("Order not found");
        return;
      }

      const newItem = {
        id: selectedProduct.id,
        color: optionSelected.color,
        size: optionSelected.size,
        quantity: optionSelected.quantity,
      };

      const updatedItems = [...(currentOrder.items || []), newItem];

      await axios.put(`http://161.97.169.6:4000/order/${id}`, {
        items: updatedItems,
      });

      setShowAddProductToOrder(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error adding product to order:", error);
      alert("Error adding product. Check console for details.");
    }
  };

  return (
    <div
      onClick={() => {
        setSelectedProduct(null);
        setOptionSelected({ color: null, size: null, quantity: 1 });
        setShowAddProductToOrder(false);
      }}
      className="w-full fixed z-40 flex items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="voucher-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0.4, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[900px] min-h-[600px] py-12 bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center gap-3"
        >
          <h1 className="text-2xl text-white">اضف منتج</h1>
          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="flex text-white w-[70%] flex-col     justify-center h-full min-h-[400px] gap-3">
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Select
                showSearch
                style={{ width: "100%", height: "50px" }}
                placeholder="Search and select a product"
                onSearch={handleSearch}
                onSelect={handleSelect}
                loading={loading}
                filterOption={false}
              >
                {products.map((p) => (
                  <Select.Option key={p.id} value={p.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "6px 10px",
                        width: "100%",
                        lineHeight: "1",
                      }}
                    >
                      <div
                        style={{
                          width: "45px",
                          height: "40px",
                          flexShrink: 0,
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={`${p.images?.[0]?.link || "default.jpg"}`}
                          alt={p.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          flexGrow: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: "#fff",
                          fontSize: "15px",
                        }}
                      >
                        {p.name}
                      </span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </ConfigProvider>

            <h1 className="w-[90%] text-[#a4a4a4]">اختر اللون:</h1>
            <div className="w-full h-[50px] border border-white/20 rounded-2xl flex items-center justify-center px-4 gap-3">
              {options.color?.length === 0 ? (
                <div className="text-white/50">لا يوجد لون</div>
              ) : (
                options.color?.map((c) => (
                  <div
                    onClick={() => {
                      setOptionSelected((prev) => ({ ...prev, color: c }));
                    }}
                    style={{
                      backgroundColor: c,
                      border:
                        optionSelected.color === c
                          ? "2px solid #fff"
                          : "2px solid rgba(255, 255, 255, 0.25)",
                      boxShadow:
                        optionSelected.color === c ? "0 0 10px #fff" : "none",
                    }}
                    key={c}
                    className="w-[40px] h-[40px] rounded-full border border-white/40"
                  ></div>
                ))
              )}
            </div>

            <h1 className="w-[90%] text-[#a4a4a4]">اختر الحجم:</h1>
            <div className="w-full h-[50px] border border-white/20 rounded-2xl flex items-center justify-center px-4 gap-3">
              {options.size?.length === 0 ? (
                <div className="text-white/50">لا يوجد حجم</div>
              ) : (
                options.size?.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setOptionSelected((prev) => ({ ...prev, size: s }));
                    }}
                    style={{
                      borderColor:
                        optionSelected.size === s
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.25)",
                      boxShadow:
                        optionSelected.size === s ? "0 0 10px #fff" : "none",
                      backgroundColor:
                        optionSelected.size === s
                          ? "rgba(255, 255, 255, 0.25)"
                          : "transparent",
                    }}
                    className="w-[40px] h-[40px] flex justify-center items-center text-center border border-white/40 rounded-sm"
                  >
                    {s}
                  </div>
                ))
              )}
            </div>

            <h1 className="w-[90%] text-[#a4a4a4]">اختر الكمية:</h1>
            <ConfigProvider
              className="w-full"
              theme={{ algorithm: theme.darkAlgorithm }}
            >
              <InputNumber
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "12px",
                  fontSize: "26px",
                  padding: "0 12px",
                  color: "#fff",
                }}
                value={optionSelected.quantity}
                onChange={(value) =>
                  setOptionSelected((prev) => ({ ...prev, quantity: value }))
                }
                min={1}
                max={10}
                defaultValue={3}
              />
            </ConfigProvider>
            <button
              onClick={handelAdd}
              className="bg-[#F2F2F2] active:scale-95 hover:bg-[#f2f2f2dd] h-[50px] w-[100%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
            >
              اضافة المنتج
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddProductToOrder;
