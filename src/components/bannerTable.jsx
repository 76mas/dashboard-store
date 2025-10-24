import React, { useEffect, useState } from "react";
import { Table, Space, Button, ConfigProvider, theme, Select } from "antd";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { PiFlagBannerBold } from "react-icons/pi";
import Container from "./container";
import axios from "axios";
import { useStatment } from "../context/maping";

import { IoCloseOutline } from "react-icons/io5";
import { TbPhotoShare } from "react-icons/tb";

import { GrRedo } from "react-icons/gr";

import { IoAlertCircleOutline } from "react-icons/io5";

import SelectCategory from "./selectCategory";
import SelectType from "./selectType";
const BannerTable = () => {
  const [banners, setBanners] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [bannerId, setBannerId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {
    setShowAlert,
    setDeleteitems,
    setEditShowBanner,
    bannerType,
    map,
    // setBannerId,
  } = useStatment();

  useEffect(() => {
    GetBanners();
  }, [refresh]);

  const GetBanners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/banner");
      setBanners(res.data);
    } catch (err) {
      console.log(err);
    }
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
      title: "Categories Count",
      key: "categoriesCount",
      render: (_, record) => <span>{record.map ? record.map.length : 0}</span>,
    },
    {
      title: "Action",
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
            Edit
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
            Delete
          </Button>
        </Space>
      ),
    },
  ];

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
                Add Banner
              </button>

              <div className="flex items-center w-[400px] relative">
                <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                <input
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  value={search}
                  type="text"
                  placeholder="Search Banners..."
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

//ربط ما تبقا من banner

const AddBanner = ({
  setShowAddBanner,
  bannerId,
  setBannerId,
  refresh,
  setRefresh,
}) => {
  // const { bannerType, map } = useStatment();
  const [image, setImage] = useState(null);
  const [showclose, setShowclose] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [banner, setBanner] = useState({
    name: "",
    type: "single",
    priority: 1,
  });

  const [isUpload, setIsUpload] = useState(false);

  console.log("banner", banner);
  useEffect(() => {
    getCategory();
    if (bannerId) {
      getBanner();
      setIsUpload(true);
    }
  }, []);

  const handekAddBanner = async () => {
    let data = new FormData();
    // const maping=banner.map.map(item=>{"category_id":item})
    // const mapping = [];
    // mapping.push(
    //   banner.map.map((item) => ({
    //     item,
    //   }))
    // );

    data.append("image", image);
    data.append("name", banner.name);
    data.append("type", banner.type);
    data.append("priority", banner.priority);
    data.append("map", JSON.stringify(banner.map));
    if (banner.name === "" || banner.type === "" || banner.priority <= 0) {
      return;
    }
    try {
      const resoponse = await axios.post("http://localhost:4000/banner", data);
      console.log("add banner success", resoponse.data);
      setShowAddBanner(false);
      setBannerId(null);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get("http://localhost:4000/category");
      console.log("category", res.data);
      setCategorys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBanner = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/banner/${bannerId}`);
      console.log("abnnner data edit", res.data);
      setBanner(res.data);

      setImage(res.data.background);
    } catch (err) {
      console.log(err);
    }
  };

  const handelEdit = async () => {
    let data = new FormData();
    data.append("image", image);
    data.append("name", banner.name);
    data.append("type", banner.type);
    data.append("priority", banner.priority);
    data.append("map", JSON.stringify(banner.map));
    if (banner.name === "" || banner.type === "" || banner.priority <= 0) {
      return;
    }
    try {
      const resoponse = await axios.put(
        `http://localhost:4000/banner/${bannerId}`,
        data
      );
      console.log("edit banner success", resoponse.data);
      setShowAddBanner(false);
      setBannerId(null);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const handleValue = () => {
    // إذا banner.map موجود (حتى لا يصير خطأ أول تحميل)
    if (!banner.map) return [];

    // إذا map عبارة عن أرقام مباشرة
    if (
      typeof banner.map[0] === "number" ||
      typeof banner.map[0] === "string"
    ) {
      return banner.map.map(String); // نحولها نصوص حتى تمشي ويا Select
    }

    // إذا map عبارة عن كائنات مثل {category_id: 5}
    return banner.map.map((item) => String(item.category_id));
  };

  return (
    <>
      <div
        onClick={() => {
          console.log("body clicked");
          setShowAddBanner(false);
          setBannerId(null);
        }}
        className="w-full z-40 -mt-20 fixed flex items-center justify-center bg-[#000000a8] h-full"
      >
        <AnimatePresence>
          <motion.div
            key="alert-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="    backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-[900px] min-h-[600px] py-12 no-scrollbar  bg-[#ffffff09]   border-1 border-[#ffffff4e]  backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
            >
              <h1 className="text-2xl text-white">Add Banner </h1>

              <div className="w-full h-[1px] bg-[#ffffff4e]" />

              <div className="grid text-white w-full  grid-cols-2 px-6  items-center gap-3">
                <div className="flex text-white w-full flex-col  items-center gap-3">
                  {/* NAME */}
                  <label
                    htmlFor="pname"
                    className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                  >
                    Banner Name:
                    <input
                      onChange={(e) => {
                        setBanner((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                      value={banner.name}
                      type="text"
                      id="pname"
                      className="h-full w-full  border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                      placeholder="Product Name"
                    />
                  </label>

                  {/* IMAGES */}
                  <div className="flex text-[#a4a4a4] h-[200px] items-center w-[60%] flex-col-reverse  px-2 gap-2">
                    <label
                      htmlFor="photo"
                      className="h-[50px] cursor-pointer  w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                    >
                      <h1 className="text-white cursor-pointer">Upload</h1>
                    </label>

                    <input
                      type="file"
                      id="photo"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                        setIsUpload(false);
                      }}
                      className="h-full hidden w-[90px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                      placeholder="Product Name"
                    />

                    <div className="w-full relative border border-[#ffffff4e] no-scrollbar h-full  overflow-x-scroll  gap-2 flex items-center rounded-[8px] justify-start ">
                      <div className="w-full   shadow shadow-[#ffffff18] h-full overflow-hidden flex justify-center items-center  ">
                        {image ? (
                          <img
                            onMouseMove={() => {
                              setShowclose(true);
                            }}
                            onMouseLeave={() => {
                              setShowclose(false);
                            }}
                            className="w-full flex"
                            src={
                              isUpload
                                ? `http://localhost:4000/${image}`
                                : URL.createObjectURL(image)
                            }
                          />
                        ) : (
                          <>
                            <div className="w-full h-full flex justify-center items-center">
                              <TbPhotoShare className="text-[40px]" />
                            </div>
                          </>
                        )}

                        <div
                          className={`${
                            showclose ? "flex" : "hidden"
                          } top-4 right-4 flex absolute justify-center items-center `}
                        >
                          <IoCloseOutline
                            onMouseMove={() => {
                              setShowclose(true);
                            }}
                            onMouseLeave={() => {
                              setShowclose(false);
                            }}
                            onClick={() => {
                              setImage(null);
                            }}
                            className="text-[#ffffff] drop-shadow-2xl  cursor-pointer text-2xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <label
                    htmlFor="price"
                    className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                  >
                    Banner Priority :
                    <input
                      type="number"
                      id="priority"
                      value={banner.priority}
                      onChange={(e) => {
                        setBanner((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }));
                      }}
                      className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                      placeholder="Banner Priority"
                    />
                  </label>
                </div>
                <div className="flex text-white w-full flex-col justify-center items-center gap-3">
                  <ConfigProvider
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <Select
                      mode="tags"
                      style={{
                        width: "100%",
                        alignItems: "center",
                      }}
                      placeholder="Choise Category"
                      onChange={(values) => {
                        setBanner((prev) => ({
                          ...prev,
                          map: values.map((v) => ({ category_id: Number(v) })),
                        }));
                      }}
                      value={handleValue()}
                      options={categorys.map((c) => ({
                        value: String(c.id),
                        label: c.name,
                      }))}
                    />
                  </ConfigProvider>

                  <ConfigProvider
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <Select
                      size={400}
                      defaultValue="single"
                      // onChange={handleChange}
                      onChange={(e) => {
                        setBanner((prev) => ({
                          ...prev,
                          type: e,
                        }));
                      }}
                      value={banner.type}
                      style={{ width: "100%", alignItems: "center" }}
                      options={[
                        {
                          value: "single",
                          label: "single",
                        },
                        {
                          value: "slides",
                          label: "slides",
                        },
                        {
                          value: "List",
                          label: "List",
                        },
                        {
                          value: "Timer",
                          label: "Timer",
                        },
                        {
                          value: "Category",
                          label: "Category",
                        },
                      ]}
                    />
                  </ConfigProvider>

                  <button
                    onClick={() => {
                      if (bannerId) {
                        handelEdit();
                      } else {
                        handekAddBanner();
                      }
                    }}
                    className="bg-[#F2F2F2]  hover:bg-[#f2f2f2dd] h-[50px] w-[96%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
                  >
                    {bannerId ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const AlertDelete = ({ id, setShowDelete, refresh, setRefresh }) => {
  console.log("idddd", id);
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/banner/${id}`);
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
            Are you sure you want to delete this item?
          </h1>

          <div className="flex items-center gap-3 w-[85%]">
            <button
              onClick={handleDelete}
              className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#ff00731c] transition-all duration-200"
            >
              Delete <MdDeleteOutline />
            </button>

            <button
              onClick={() => setShowDelete(false)}
              className="w-full py-2 cursor-pointer text-sky-800 border-2 border-sky-800 flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#1e90ff22] transition-all duration-200"
            >
              Cancel <GrRedo />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
