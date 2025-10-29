import { useEffect, useState } from "react";
import { uploadDirect } from "@uploadcare/upload-client";

import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Table, Space, Button, ConfigProvider, theme, Tag, Switch } from "antd";
import { Select, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineCloseFullscreen } from "react-icons/md";

const AddProduct = ({ setRefresh, refresh, setShowAddProduct }) => {
  // const { setShowAddProduct } = useStatment();
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [categorys, setCategorys] = useState([]);
  const [showAddsizes, setShowAddsizes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    related: "",
    category_id: "",
    stock: "",
    endprice: "",
    endpricedate: null,
  });

  useEffect(() => {
    getCategory();
  }, []);

  const handelAddProduct = async () => {
    const data = {
      ...product,
      related: product.category_id,
      options: [
        {
          color: colors,
          size: sizes,
        },
      ],
    };

    if (
      data.name === "" ||
      data.description === "" ||
      data.price === "" ||
      data.category_id === "" ||
      data.stock === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ إضافة المنتج أولاً
      const response = await axios.post(
        "http://161.97.169.6:4000/product",
        data
      );

      // 2️⃣ رفع الصور
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const result = await uploadDirect(file, {
          publicKey: "0561aa737ff71db6dae7",
          store: true, // ضروري حتى ما تختفي الصور
        });

        // دعم الحالتين (cdnUrl أو file)
        const cdnUrl = `https://3km3cceozg.ucarecd.net//${result.uuid}/`;

        console.log("Uploaded:", cdnUrl);

        // 3️⃣ حفظ الصورة بقاعدة البيانات
        await axios.post("http://161.97.169.6:4000/images", {
          link: cdnUrl,
          product_id: response.data.id,
          priority: i + 1,
        });
      }

      setShowAddProduct(false);
      setRefresh(!refresh);
    } catch (err) {
      console.log("Error adding product:", err);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get("http://161.97.169.6:4000/category");
      setCategorys(res.data);
      console.log("category", res.data);
      setProduct((prev) => ({ ...prev, category_id: res.data[0]?.id }));
    } catch (err) {
      console.log(err);
    }
  };

  const handelAddimage = (e) => {
    setImages([...images, e.target.files[0]]);
  };

  const handelAddcolor = (e) => {
    const newColor = e.target.value;
    if (!colors.includes(newColor)) {
      setColors((prev) => [...prev, newColor]);
    }
  };

  const handleSelectCategory = (id) => {
    setProduct((prev) => ({ ...prev, category_id: id }));
  };

  return (
    <>
      <div
        onClick={() => {
          setShowAddProduct(false);
        }}
        className="w-full z-40 fixed top-0 scroll-hide  flex items-center justify-center bg-[#000000a8] h-full "
      >
        <AnimatePresence>
          <motion.div
            key="alert-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[900px] min-h-[600px] py-12 no-scrollbar  bg-[#ffffff09] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
          >
            <h1 className="text-2xl text-white">اضافة منتج</h1>

            <div className="w-full h-[1px] bg-[#ffffff4e]" />

            <div className="grid text-white w-full  grid-cols-2 px-6  items-center gap-3">
              <div className="flex text-white w-full flex-col  items-center gap-3">
                {/* NAME */}
                <label
                  htmlFor="pname"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                >
                  اسم المنتج:
                  <input
                    onChange={(e) => {
                      setProduct({ ...product, name: e.target.value });
                    }}
                    type="text"
                    id="pname"
                    className="h-full w-full  border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="اسم المنتج"
                  />
                </label>
                {/* IMAGES */}
                <div className="flex text-[#a4a4a4] h-[50px]  w-full px-2 gap-2">
                  <label
                    htmlFor="photo"
                    className="h-full cursor-pointer active:scale-95 w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">الصور</h1>
                  </label>

                  <input
                    type="file"
                    id="photo"
                    onChange={(e) => {
                      handelAddimage(e);
                    }}
                    className="h-full hidden w-[90px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="Product Name"
                  />

                  <div className="w-full border border-[#ffffff4e] no-scrollbar  overflow-x-scroll  gap-2 flex items-center rounded-[8px] justify-start px-2">
                    {images.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 w-[85px] border border-[#ffffff4e]  items-center rounded-[8px] p-1"
                      >
                        <div className="w-[34px]   shadow shadow-[#ffffff18] h-[34px] overflow-hidden flex justify-center items-center rounded-full ">
                          <img
                            className="h-full"
                            src={URL.createObjectURL(item)}
                            alt="img-product"
                          />
                        </div>

                        <IoCloseOutline
                          onClick={() => {
                            setImages(images.filter((_, i) => i !== index));
                          }}
                          className="text-2xl cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLORS */}
                <div className="flex text-[#a4a4a4] h-[50px]  w-full px-2 gap-2">
                  <label
                    htmlFor="color"
                    className="h-full cursor-pointer active:scale-95 w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">الالوان</h1>
                  </label>

                  <input
                    type="color"
                    id="color"
                    onBlur={(e) => handelAddcolor(e)}
                    className=" w-0 opacity-0 absolute -z-10 h-0 border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  />

                  <div className="w-full border  no-scrollbar  overflow-x-scroll  border-[#ffffff4e] gap-2 flex items-center rounded-[8px] justify-start px-2">
                    {colors.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 w-[85px] border border-[#ffffff4e]  items-center rounded-[8px] p-1"
                      >
                        <div
                          style={{ backgroundColor: item }}
                          className="w-[34px]   shadow shadow-[#ffffff18] h-[34px] overflow-hidden flex justify-center items-center rounded-full "
                        ></div>

                        <IoCloseOutline
                          onClick={() => {
                            setColors(colors.filter((_, i) => i !== index));
                          }}
                          className="text-2xl cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* size */}
                <div className="flex text-[#a4a4a4] h-[50px]  w-full px-2 gap-2">
                  <label
                    onClick={() => setShowAddsizes(!showAddsizes)}
                    htmlFor="size"
                    className="h-full cursor-pointer active:scale-95 w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">الاحجام</h1>
                  </label>
                  {showAddsizes && (
                    <div className="w-[200px] p-2  left-0 mt-15 ml-2 absolute h-[160px]  bg-[#070707] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3">
                      <MdOutlineCloseFullscreen
                        onClick={() => {
                          setShowAddsizes(false);
                        }}
                        className=" absolute cursor-pointer z-4  top-[4px] right-2"
                      />

                      <input
                        type="text"
                        id="size"
                        onChange={(e) => {
                          setSize(e.target.value);
                        }}
                        // value={size}
                        placeholder="Size"
                        className=" w-full  h-[50px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                      />
                      <button
                        onClick={() => {
                          if (sizes.includes(size) || size === "") return;
                          setSizes((prev) => [...prev, size]);
                          setSize("");
                          setShowAddsizes(false);
                        }}
                        className="bg-[#ffffff] active:scale-95 w-[50%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
                      >
                        اضف
                      </button>
                    </div>
                  )}

                  <div className="w-full border  no-scrollbar  overflow-x-scroll  border-[#ffffff4e] gap-2 flex items-center rounded-[8px] justify-start px-2">
                    {sizes.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 w-[85px] border border-[#ffffff4e]  items-center rounded-[8px] p-1"
                      >
                        <div className="w-[34px]   shadow border border-[#ffffff4e] h-[34px] overflow-hidden flex justify-center items-center rounded-[8px] ">
                          {item}
                        </div>

                        <IoCloseOutline
                          onClick={() => {
                            setSizes(sizes.filter((_, i) => i !== index));
                          }}
                          className="text-2xl cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <label className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2">
                  تصنيف المنتج:
                  {/* <select
                    onChange={(e) => {
                      setProduct({ ...product, category_id: e.target.value });
                    }}
                    id="category"
                    // value={product.category[0].id}
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="Product category"
                  >
                    {categorys.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select> */}
                  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                    <Select
                      key="select-product"
                      showSearch
                      filterOption={false}
                      value={product.category_id}
                      options={categorys.map((p) => ({
                        value: p.id,
                        label: p.name,
                      }))}
                      onSelect={handleSelectCategory}
                      loading={loading}
                      placeholder="اختر المنتجات"
                    />
                  </ConfigProvider>
                </label>

                {/* PRICE */}

                <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                >
                  سعر المنتج:
                  <input
                    onChange={(e) => {
                      setProduct({ ...product, price: e.target.value });
                    }}
                    type="number"
                    id="price"
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="سعر المنتج"
                  />
                </label>
              </div>
              <div className="flex text-white w-full flex-col justify-center items-center gap-3">
                <label
                  htmlFor="endprice"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                >
                  السعر النهائي للمنتج:
                  <input
                    onChange={(e) => {
                      setProduct({ ...product, endprice: e.target.value });
                    }}
                    type="endprice"
                    value={product.endprice}
                    id="stock"
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="السعر النهائي"
                  />
                </label>{" "}
                <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                  تاريخ انتهاء السعر النهائي:
                  <Form.Item>
                    <ConfigProvider
                      style={{ height: "50px", width: "100%" }}
                      theme={{ algorithm: theme.darkAlgorithm }}
                    >
                      <DatePicker
                        placeholder="اختر التاريخ الذي ينتهي فيه السعر النهائي"
                        style={{ height: "50px", width: "100%" }}
                        onChange={(date) =>
                          setProduct({ ...product, endpricedate: date })
                        }
                        value={
                          product?.endpricedate
                            ? dayjs(product.endpricedate)
                            : null
                        }
                      />
                    </ConfigProvider>
                  </Form.Item>
                </label>
                <label
                  htmlFor="stoke"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                >
                  مخزون المنتج:
                  <input
                    onChange={(e) => {
                      setProduct({ ...product, stock: e.target.value });
                    }}
                    type="number"
                    id="stock"
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="المخزون"
                  />
                </label>
                {/* DESCRIPTION */}
                <label
                  htmlFor="w3review"
                  className=" flex text-[#a4a4a4] flex-col   w-full px-2 gap-2"
                >
                  وصف المنتج:
                  <textarea
                    onChange={(e) => {
                      setProduct({ ...product, description: e.target.value });
                    }}
                    id="w3review"
                    placeholder="وصف المنتج"
                    name="w3review"
                    rows="4"
                    cols="50"
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  ></textarea>
                </label>
                <button
                  onClick={handelAddProduct}
                  disabled={loading}
                  className={`h-[50px] w-[96%] px-4 py-2 rounded-md 
    ${
      loading
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-[#F2F2F2] hover:bg-[#f2f2f2dd] cursor-pointer"
    } 
    text-[#000] active:scale-95 flex items-center justify-center gap-2`}
                >
                  {loading ? "انتظر..." : "اضف المنتج"}
                </button>
              </div>
            </div>
            {/* </div> */}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default AddProduct;
