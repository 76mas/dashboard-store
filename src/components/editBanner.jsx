import { useEffect, useState } from "react";
import { useStatment } from "../context/maping";
import { IoCloseOutline } from "react-icons/io5";
import { TbPhotoShare } from "react-icons/tb";
import axios from "axios";
import SelectCategory from "./selectCategory";
import SelectType from "./selectType";
import { Edit } from "lucide-react";
import { uploadDirect } from "@uploadcare/upload-client";

const EditBanner = () => {
  const {
    bannerType,
    map,
    showEditBanner,
    setEditShowBanner,
    bannerId,
    setBannerId,
  } = useStatment();
  const [image, setImage] = useState();
  const [showclose, setShowclose] = useState(false);
  const [categorys, setCategorys] = useState([]);

  const [banner, setBanner] = useState({});

  useEffect(() => {
    getBanner();
    getCategory();
  }, []);

  const handekAddBanner = async () => {
    let data = new FormData();
    data.append("image", image);
    data.append("name", banner.name);
    data.append("type", banner.type);
    data.append("priority", banner.priority);
    data.append("map", JSON.stringify(map));
    if (banner.name === "" || banner.type === "" || banner.priority <= 0) {
      return;
    }
    try {
      const resoponse = await axios.post("http://localhost:4000/banner", data);
      console.log("add banner success", resoponse.data);
      setEditShowBanner(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handelUpdateBanner = async () => {
    // let data = new FormData();
    // data.append("image", image);
    // data.append("name", banner.name);
    // data.append("type", banner.type);
    // data.append("priority", banner.priority);
    // data.append("map", JSON.stringify([...map]) );

    const file = image;
    const result = await uploadDirect(file, {
      publicKey: "0561aa737ff71db6dae7",
      store: true, // ضروري حتى ما تختفي الصور
    });

    // دعم الحالتين (cdnUrl أو file)
    const cdnUrl = `https://3km3cceozg.ucarecd.net//${result.uuid}/`;

    let data = {
      name: banner.name,
      type: banner.type,
      priority: banner.priority,
      image: cdnUrl,
      map: map,
    };

    if (banner.name === "" || banner.type === "" || banner.priority <= 0) {
      return;
    }
    try {
      const resoponse = await axios.put(
        `http://localhost:4000/banner/${bannerId}`,
        data
      );
      console.log("add banner success", resoponse.data);
      setEditShowBanner(false);
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
  const getCategory = async () => {
    try {
      const res = await axios.get("http://localhost:4000/category");
      console.log("category", res.data);
      setCategorys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          console.log("body clicked");
          setEditShowBanner(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#000000a8] h-full"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[900px] min-h-[600px] py-12 no-scrollbar  bg-[#ffffff09] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <h1 className="text-2xl text-white">Edit Banner </h1>

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
                    setBanner((prev) => ({ ...prev, name: e.target.value }));
                  }}
                  type="text"
                  value={banner?.name}
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
                  value={banner?.image}
                  onChange={(e) => {
                    setImage(e.target.files[0]);
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
                          banner.background.includes("http")
                            ? `${banner.background}`
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
                  value={banner?.priority}
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
              <SelectCategory categorys={categorys} mapget={banner.map} />

              {/* <SelectType type={banner?.type} /> */}
              <button
                onClick={() => {
                  handelUpdateBanner();
                }}
                className="bg-[#F2F2F2]  hover:bg-[#f2f2f2dd] h-[50px] w-[96%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBanner;
