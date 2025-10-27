import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  ConfigProvider,
  theme,
  Select,
  Tag,
  Switch,
  Upload,
  Form,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  MdDeleteOutline,
  MdOutlineCloseFullscreen,
  MdOutlineDone,
} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
// import { PiFlagBannerBold } from "react-icons/pi";
import Container from "@/components/container";
import axios from "axios";
import { useStatment } from "@/context/maping";

import { IoClose, IoCloseOutline } from "react-icons/io5";
import { TbPhotoShare } from "react-icons/tb";

import { GrRedo } from "react-icons/gr";

import { IoAlertCircleOutline } from "react-icons/io5";
import { uploadDirect } from "@uploadcare/upload-client";

const BannerTable = () => {
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [bannerId, setBannerId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { bannerType } = useStatment();

  useEffect(() => {
    GetBanners();
  }, [refresh]);

  const GetBanners = async () => {
    try {
      const res = await axios.get("http://161.97.169.6:4000/banner");
      setBanners(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "الاولوية",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "عدد الفئات المرتبطة",
      key: "categoriesCount",
      render: (_, record) => <span>{record.map ? record.map.length : 0}</span>,
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
      title: "الاجراءات",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              // setEditShowBanner(true);
              setShowAddBanner(true);
              setBannerId(record.id);
            }}
            type="primary"
            icon={<CiEdit />}
          >
            تعديل
          </Button>{" "}
          <Button
            danger
            onClick={() => {
              // setShowAlert(true);
              // setDeleteitems({ id: record.id, name: "banner" });
              setShowDelete(true);
              setBannerId(record.id);
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

  const handelChangeActive = async (id, newActive) => {
    try {
      await axios.put(`http://161.97.169.6:4000/banner/${id}`, {
        active: newActive,
      });
      // getAllProducts();
      setRefresh(!refresh);
    } catch (e) {
      console.log(e);
    }
  };

  const data = banners.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="w-full  flex flex-col  h-full items-center">
      <div className="w-full  flex justify-center mt-5 h-[70px]">
        <Container>
          <div className="w-full h-full flex items-center flex-col">
            <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
              <button
                onClick={() => {
                  setShowAddBanner(true);
                }}
                className="bg-[#F2F2F2] cursor-pointer px-4 py-2 rounded-md"
              >
                اضف بانر جديد
              </button>

              <div className="flex items-center w-[400px] relative">
                <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                <input
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                  type="text"
                  placeholder="ابحث عن البانر..."
                  className="pl-10 pr-4 py-2 rounded-md w-full bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        {/* <div className=""> */}
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
                dataSource={data}
                className="w-full"
              />
            </Container>
          </motion.div>
        </AnimatePresence>
        {/* </div> */}
      </ConfigProvider>

      {showAddBanner && (
        <AddBanner
          refresh={refresh}
          setRefresh={setRefresh}
          bannerType={bannerType}
          bannerId={bannerId}
          setShowAddBanner={setShowAddBanner}
          setBannerId={setBannerId}
          banners={banners}
        />
      )}
      {showDelete && (
        <AlertDelete
          id={bannerId}
          setShowDelete={setShowDelete}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default BannerTable;

const AddBanner = ({
  setShowAddBanner,
  bannerId,
  setBannerId,
  refresh,
  setRefresh,
  banners,
}) => {
  const [image, setImage] = useState(null);
  const [showclose, setShowclose] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [endDate, setEndDate] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]); // ✅ منتجات مختارة فقط أرقام
  const [productSelected, setProductSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleBannerSelected, setSingleBannerSelected] = useState([]);
  const [banner, setBanner] = useState({
    name: "",
    type: "single",
    priority: 1,
    map: [],
  });

  useEffect(() => {
    getCategory();
    fetchProducts();
    if (bannerId) getBanner();
  }, []);

  const getCategory = async () => {
    try {
      const res = await axios.get("http://161.97.169.6:4000/category");
      setCategorys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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

  const getBanner = async () => {
    try {
      const res = await axios.get(
        `http://161.97.169.6:4000/banner/${bannerId}`
      );
      const data = res.data;
      setBanner(data);
      setImage(data.background);
      setProductSelected(data.map);
      console.log("abnnner data edit", data);
      if (data.type === "Timer") {
        setProductSelected(data.map[0].products);
        setEndDate(data?.map[0]?.end_date);
      }
      setSingleBannerSelected(data.map);

      console.log("abnnner data edit", data);

      if (data.type === "Category") {
        setBanner((prev) => ({
          ...prev,
          map: data.map || [],
        }));
      } else {
        setSelectedProductIds(data?.map);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;
    if (typeof image === "string") return image;
    const result = await uploadDirect(image, {
      publicKey: "0561aa737ff71db6dae7",
      store: true,
    });
    return `https://3km3cceozg.ucarecd.net//${result.uuid}/`;
  };

  const handleSubmit = async () => {
    if (!banner.name.trim()) return alert("أدخل اسم البانر");
    if (!banner.type.trim()) return alert("اختر نوع البانر");
    if (banner.priority <= 0) return alert("أولوية البانر يجب أن تكون موجبة");

    setLoading(true);
    try {
      const cdnUrl = await uploadImage();
      let data = {
        name: banner.name,
        type: banner.type,
        priority: banner.priority,
        background: cdnUrl,
        // map: banner.type === "Category" ? banner.map : selectedProductIds,
        map: banner.type === "Category" ? banner.map : productSelected || [],
      };

      if (banner.type === "slides") {
        data.map = singleBannerSelected || [];
      }

      if (banner.type === "Timer") {
        data.map = [
          {
            end_date: endDate,
            products: data.map,
          },
        ];
      }
      // console.log("data", data);
      // return;
      if (bannerId) {
        await axios.put(`http://161.97.169.6:4000/banner/${bannerId}`, data);
      } else {
        await axios.post("http://161.97.169.6:4000/banner", data);
      }

      setShowAddBanner(false);
      setBannerId(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error saving banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (ids) => {
    setBanner({
      ...banner,
      map: ids.map((id) => ({ category_id: id })),
    });
  };

  const handleSelectProduct = (value) => {
    const selected = products.find((p) => p.id === value);

    setProductSelected([...productSelected, selected]);

    console.log("Selected product:", selected);
  };

  console.log("productSelected", productSelected);

  const handleSelectBanner = (value) => {
    const selected = banners.find((p) => p.id === value);

    setSingleBannerSelected([...singleBannerSelected, selected]);
  };

  const handleDeslectBanner = (value) => {
    setSingleBannerSelected(singleBannerSelected.filter((p) => p.id !== value));
  };

  const handleDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div
      onClick={() => {
        setShowAddBanner(false);
        setBannerId(null);
      }}
      className="w-full z-40 -mt-20 fixed flex items-center justify-center bg-[#000000a8] h-full"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="w-[900px] min-h-[600px] bg-[#ffffff09] border border-[#ffffff4e] backdrop-blur-2xl shadow-md rounded-2xl p-6 flex flex-col gap-4"
      >
        <h1 className="text-2xl text-white text-center">
          {bannerId ? "تعديل بانر" : "إضافة بانر"}
        </h1>

        {/* الاسم */}
        <input
          type="text"
          value={banner.name}
          onChange={(e) => setBanner({ ...banner, name: e.target.value })}
          className="w-full border border-[#ffffff4e] bg-transparent text-white/50 p-2 rounded-md"
          placeholder="اسم البانر"
        />

        {/* الصورة */}
        <div className="flex flex-col items-center gap-2">
          <input
            id="photo"
            type="file"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {banner.type === "single" &&
            (image ? (
              <img
                onMouseMove={() => {
                  setShowclose(true);
                }}
                onMouseLeave={() => {
                  setShowclose(false);
                }}
                className="w-[300px] h-[150px] object-cover rounded-md"
                src={
                  typeof image === "string"
                    ? `${image}`
                    : URL.createObjectURL(image)
                }
              />
            ) : (
              <>
                <div className="w-[300px] h-[150px] border border-[#ffffff4e] rounded-md flex justify-center items-center">
                  <TbPhotoShare className="text-[40px] text-[#ffffff4e]" />
                </div>
              </>
            ))}
          {banner.type === "single" && (
            <label
              htmlFor="photo"
              className="text-white border border-[#ffffff4e] rounded-md  px-4 py-2 mt-3 active:scale-95 cursor-pointer"
            >
              {image ? "تغيير الصورة" : "تحميل صورة"}
            </label>
          )}
        </div>

        {/* النوع */}
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Select
            value={banner.type}
            onChange={(val) => {
              setBanner({ ...banner, type: val, map: [] });
              setSelectedProductIds([]);
            }}
            options={[
              { value: "single", label: "مفرد" },
              { value: "slides", label: "شرائح" },
              { value: "List", label: "قائمة" },
              { value: "Timer", label: "مؤقت" },
              { value: "Category", label: "فئة" },
            ]}
          />
        </ConfigProvider>

        {/* اختيار الفئات أو المنتجات */}
        {banner.type === "Category" ? (
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <Select
              key="select-category"
              mode="multiple"
              value={banner.map.map((m) => m.category_id)}
              options={categorys.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onChange={handleSelectCategory}
              placeholder="اختر الفئات المرتبطة"
            />
          </ConfigProvider>
        ) : banner.type === "List" || banner.type === "single" ? (
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <Select
              mode="multiple"
              key="select-product"
              showSearch
              filterOption={false}
              value={productSelected.map((p) => p?.id)}
              options={products.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              onSelect={handleSelectProduct}
              onSearch={fetchProducts}
              loading={loading}
              placeholder="اختر المنتجات"
            />
          </ConfigProvider>
        ) : banner.type === "Timer" ? (
          <>
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Select
                mode="multiple"
                key="select-product"
                showSearch
                filterOption={false}
                value={productSelected.map((p) => p?.id)}
                options={products.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                onSelect={handleSelectProduct}
                onSearch={fetchProducts}
                loading={loading}
                placeholder="اختر المنتجات"
              />

              <Form.Item>
                <ConfigProvider
                  style={{ height: "50px", width: "100%" }}
                  theme={{ algorithm: theme.darkAlgorithm }}
                >
                  <DatePicker
                    placeholder="اختر تاريخ الانتهاء"
                    style={{ height: "50px", width: "100%" }}
                    onChange={handleDateChange}
                    // value={endDate}
                    format="YYYY-MM-DD"
                    // disabledDate={disabledDate}
                    allowClear
                    size="large"
                    className="w-full border border-[#ffffff4e] bg-transparent text-white/50 p-2 rounded-md"
                    // placeholder="اختر تاريخ الانتهاء"

                    
                  />
                </ConfigProvider>
              </Form.Item>
            </ConfigProvider>
          </>
        ) : (
          banner.type === "slides" && (
            <>
              <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <Select
                  mode="multiple"
                  key="select-product"
                  showSearch
                  filterOption={false}
                  value={singleBannerSelected.map((p) => p?.id)}
                  options={banners
                    .filter((p) => p.type === "single")
                    .map((p) => ({
                      value: p.id,
                      label: p.name,
                    }))}
                  onSelect={handleSelectBanner}
                  onDeselect={handleDeslectBanner}
                  loading={loading}
                  placeholder="اختر البنرات"
                />
              </ConfigProvider>
            </>
          )
        )}

        <input
          type="number"
          value={banner.priority}
          onChange={(e) =>
            setBanner({ ...banner, priority: Number(e.target.value) })
          }
          className="w-full border border-[#ffffff4e]  outline-0 bg-transparent text-white p-2 rounded-md"
          placeholder="أولوية البانر"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#F2F2F2] text-black py-2 rounded-md hover:bg-[#f2f2f2dd]"
        >
          {loading ? "جارٍ الحفظ..." : bannerId ? "تحديث" : "إضافة"}
        </button>
      </motion.div>
    </div>
  );
};

const AlertDelete = ({ id, setShowDelete, refresh, setRefresh }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://161.97.169.6:4000/banner/${id}`);
      setShowDelete(false);

      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => {
        setShowDelete(false);
      }}
      className="w-full z-40 fixed flex -translate-y-20  items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="alert-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[400px] h-[200px] bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <IoAlertCircleOutline className="text-[30px] text-[#ff0073cc]" />

          <h1 className="text-[#ddd] text-center">
            هل أنت متأكد من حذف هذا البانر؟
          </h1>

          <div className="flex items-center gap-3 w-[85%]">
            <button
              onClick={handleDelete}
              className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#ff00731c] transition-all duration-200"
            >
              حذف <MdDeleteOutline />
            </button>

            <button
              onClick={() => setShowDelete(false)}
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
