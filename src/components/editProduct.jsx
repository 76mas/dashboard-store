import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Table, Space, Button, ConfigProvider, theme, Tag, Switch } from "antd";
import { Select, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { uploadDirect } from "@uploadcare/upload-client";
import { MdCloseFullscreen } from "react-icons/md";

const EditProduct = ({
  refresh,
  setRefresh,
  setEditShowProduct,
  productDetails,
}) => {
  const [images, setImages] = useState(
    productDetails.images.map((item) => item)
  );

  const [newImages, setNewImages] = useState([]);

  const [colors, setColors] = useState([
    ...(productDetails.options[0].color || []),
  ]);

  const [sizes, setSizes] = useState([
    ...(productDetails.options[0].size || []),
  ]);

  const [loading, setLoading] = useState(false);

  const [size, setSize] = useState("");

  const [categorys, setCategorys] = useState([]);

  const [ImageRemoved, setImageRemoved] = useState([]);

  const [showAddsizes, setShowAddsizes] = useState(false);

  const [product, setProduct] = useState(productDetails);

  useEffect(() => {
    getCategory();
  }, []);

  const handelAddProduct = async () => {
    const data = {
      ...product,
      removeEventListener: product.category_id,
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
      const resoponse = await axios.put(
        `https://mahmod.puretik.info/api/product/${productDetails.id}`,
        data
      );

      // 2️⃣ رفع الصور

      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const result = await uploadDirect(file, {
            publicKey: "0561aa737ff71db6dae7",
            store: true, // ضروري حتى ما تختفي الصور
          });

          // دعم الحالتين (cdnUrl أو file)
          const cdnUrl = `https://3km3cceozg.ucarecd.net//${result.uuid}/`;

          console.log("Uploaded:", cdnUrl);

          // 3️⃣ حفظ الصورة بقاعدة البيانات
          await axios.post("https://mahmod.puretik.info/api/images", {
            link: cdnUrl,
            product_id: resoponse.data.id,
            priority: i + 1,
          });
        }
      }

      if (ImageRemoved.length > 0) {
        try {
          for (let i = 0; i < ImageRemoved.length; i++) {
            await axios.delete(
              `https://mahmod.puretik.info/api/images/${ImageRemoved}`
            );
          }
        } catch (err) {
          console.log(err);
        }
      }

      setLoading(false);
      setEditShowProduct(false);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get("https://mahmod.puretik.info/api/category");

      setCategorys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handelAddcolor = (e) => {
    const newColor = e.target.value;
    if (!colors.includes(newColor)) {
      setColors((prev) => [...prev, newColor]);
    }
  };

  console.log("images", images);

  const handleSelectCategory = (id) => {
    setProduct((prev) => ({ ...prev, category_id: id }));
  };
  return (
    <>
      <div
        onClick={() => {
          setEditShowProduct(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#000000a8] h-screen top-0 left-0"
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
            <h1 className="text-2xl text-white">تعديل المنتج</h1>

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
                    value={product.name}
                    id="pname"
                    className="h-full w-full  border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="اسم المنتج"
                  />
                </label>
                {/* IMAGES */}
                <div className="flex text-[#a4a4a4] h-[50px]  w-full px-2 gap-2">
                  <label
                    htmlFor="photo"
                    className="h-full cursor-pointer  w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">الصور</h1>
                  </label>

                  <input
                    type="file"
                    id="photo"
                    onChange={(e) => {
                      // handelAddimage(e);

                      const file = e.target.files[0];
                      if (file) {
                        setImages((prev) => [
                          ...prev,
                          URL.createObjectURL(file),
                        ]);

                        setNewImages((prev) => [...prev, file]);
                      }
                    }}
                    className="h-full hidden w-[90px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  />

                  <div className="w-full border border-[#ffffff4e] no-scrollbar  overflow-x-scroll  gap-2 flex items-center rounded-[8px] justify-start px-2">
                    {images.map(
                      (item, index) => (
                        console.log("item", item[0]),
                        (
                          <div
                            key={index}
                            className="flex gap-3 w-[85px] border border-[#ffffff4e]  items-center rounded-[8px] p-1"
                          >
                            <div className="w-[34px]   shadow shadow-[#ffffff18] h-[34px] overflow-hidden flex justify-center items-center rounded-full ">
                              <img
                                className="h-full"
                                src={
                                  typeof item === "string" ? item : item.link
                                }
                                alt="img-product"
                              />
                            </div>

                            <IoCloseOutline
                              onClick={() => {
                                setImageRemoved([...ImageRemoved, item.id]);
                                setImages(images.filter((_, i) => i !== index));
                                setNewImages(
                                  newImages.filter((_, i) => i !== index)
                                );
                                console.log("ImageRemoved", ImageRemoved);
                              }}
                              className="text-2xl cursor-pointer"
                            />
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>

                {/* COLORS */}
                <div className="flex text-[#a4a4a4] h-[50px]  w-full px-2 gap-2">
                  <label
                    htmlFor="color"
                    className="h-full cursor-pointer  w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
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
                    className="h-full cursor-pointer  w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">الاحجام</h1>
                  </label>
                  {showAddsizes && (
                    <div className="w-[200px] p-2   left-0 mt-15 ml-2 absolute h-[160px]  bg-[#070707] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3">
                      <MdCloseFullscreen
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
                        placeholder="حجم المنتج"
                        className=" w-full  h-[50px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                      />
                      <button
                        onClick={() => {
                          if (sizes.includes(size) || size === "") return;
                          setSizes((prev) => [...prev, size]);
                          setSize("");
                          setShowAddsizes(false);
                        }}
                        className="bg-[#ffffff] w-[50%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
                      >
                        اضف
                      </button>
                    </div>
                  )}

                  <div className="w-full border  no-scrollbar  overflow-x-scroll  border-[#ffffff4e] gap-2 flex items-center rounded-[8px] justify-start px-2">
                    {sizes?.map((item, index) => (
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
                  اختر التصنيف:
                  {/* <select
                    onChange={(e) => {
                      setProduct({
                        ...product,
                        category_id: Number(e.target.value),
                      });
                    }}
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  >
                    {categorys.map((item) => (
                      <option
                        key={item.id}
                        selected={
                          Number(product.category_id) === Number(item.id)
                        }
                        value={item.id}
                      >
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
                    value={product.price}
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="Product price"
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
                    type="number"
                    value={product.endprice}
                    id="endprice"
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="Product end Price"
                  />
                </label>
                <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                  تاريخ انتهاء السعر النهائي:
                  <Form.Item>
                    <ConfigProvider
                      style={{ height: "50px", width: "100%" }}
                      theme={{ algorithm: theme.darkAlgorithm }}
                    >
                      <DatePicker
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
                    value={product.stock}
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
                    value={product.description}
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
    text-[#000]`}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default EditProduct;
