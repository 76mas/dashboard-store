import { useEffect, useState } from "react";
import { useStatment } from "../context/maping";
import { IoCloseOutline } from "react-icons/io5";
import { TbPhotoShare } from "react-icons/tb";
import axios from "axios";
import SelectCategory from "./selectCategory";
import SelectType from "./selectType";
import { AnimatePresence, motion } from "framer-motion";
import { uploadDirect } from "@uploadcare/upload-client";

const EditCategory = ({ setShowEditCategory, id, refresh, setRefresh }) => {
  // const { categoryId, setShowEditCategory } = useStatment();
  const [image, setImage] = useState();
  const [showclose, setShowclose] = useState(false);
  const [category, setCategory] = useState();

  useEffect(() => {
    getCategory();
  }, []);

  const handelAddCategory = async () => {
    const file = image;
    
    if(typeof file === "object"){
      const result = await uploadDirect(file, {
        publicKey: "0561aa737ff71db6dae7",
        store: true,
      });
      const cdnUrl = `https://3km3cceozg.ucarecd.net//${result.uuid}/`;
      setImage(cdnUrl);
      
    }
  

    let data = {
      name: category.name,
      priority: category.priority,
      image: image,
    };
    if (category.name === "" || category.priority <= 0) {
      return;
    }
    try {
      const resoponse = await axios.put(
        `http://localhost:4000/category/${id}`,
        data
      );
      console.log("add category success", resoponse.data);
      setShowEditCategory(false);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategory = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/category/${id}`);
      console.log("category", res.data);
      setCategory(res.data);
      setImage(res.data.image);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          console.log("body clicked");
          setShowEditCategory(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#000000a8] h-screen"
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
            {" "}
            <h1 className="text-2xl text-white">تعديل الفئات</h1>
            <div className="w-full h-[1px] bg-[#ffffff4e]" />
            <div className="grid text-white w-full  grid-cols-1 px-52  items-center gap-3">
              <div className="flex text-white w-full flex-col  items-center gap-3">
                {/* NAME */}
                <label
                  htmlFor="cname"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-full px-2 gap-2"
                >
                  اسم الفئة:
                  <input
                    onChange={(e) => {
                      setCategory({ ...category, name: e.target.value });
                    }}
                    value={category?.name}
                    type="text"
                    id="cname"
                    className="h-full w-full  border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="اسم الفئة"
                  />
                </label>

                {/* IMAGES */}
                <div className="flex text-[#a4a4a4] h-[200px] items-center w-[60%] flex-col-reverse  px-2 gap-2">
                  <label
                    htmlFor="photo"
                    className="h-[50px] cursor-pointer  w-[90px] border-[#ffffff8b] flex justify-center items-center outline-0 border rounded-[8px]"
                  >
                    <h1 className="text-white cursor-pointer">اضافة صورة</h1>
                  </label>

                  <input
                    type="file"
                    id="photo"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                    className="h-full hidden w-[90px] border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="اسم الفئة"
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
                            category?.image.includes("http")
                              ? `${image}`
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
                  : أولوية الفئة
                  <input
                    type="number"
                    value={category?.priority}
                    id="priority"
                    onChange={(e) => {
                      setCategory({ ...category, priority: e.target.value });
                    }}
                    className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                    placeholder="Category Priority"
                  />
                </label>
              </div>
              <div className="flex text-white w-full flex-col justify-center items-center gap-3">
                <button
                  onClick={() => {
                    handelAddCategory();
                  }}
                  className="bg-[#F2F2F2]  hover:bg-[#f2f2f2dd] h-[50px] w-[96%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
                >
                  تعديل الفئة
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default EditCategory;
