import Container from "./container";
import { useEffect, useState } from "react";
import axios from "axios";
import { BiCategoryAlt } from "react-icons/bi";
import { PiFlagBannerBold } from "react-icons/pi";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import AlertDelete from "./alertDelete";
import { useStatment } from "../context/maping";
const BannerSpace = () => {
  const [Banner, setBanner] = useState([]);

  const { setShowAlert, setDeleteitems } = useStatment();

  useEffect(() => {
    GetBanners();
  }, []);

  const GetBanners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/banner");
      console.log(res.data);
      setBanner(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const Allcatgory = () =>
    Banner.map((item, index) => (
      <div
        key={index}
        className="w-full h-[200px] text-white bg-[#282828] border-1 border-[#ffffff4e] rounded-2xl  flex flex-col p-5"
      >
        <div className="w-full h-full flex flex-col justify-around">
          <div className="w-full h-[80px] flex justify-between items-center">
            <div className="w-[30px]  rounded-[8px] items-center h-[30px] border-1 border-[#aa92f7] flex justify-center">
              <PiFlagBannerBold className="text-[20px] text-[#d6cef0]" />
            </div>

            <div className="border-1 border-[#ffffff4a]   w-[130px] h-[40px] flex items-center justify-center  rounded-[8px]">
              <h1 className="text-[15px] flex gap-3 text-[#a4a4a4] justify-center items-center">
                Cayegores :{" "}
                <span className="text-[#ffff] text-lg">{item.map.length}</span>
              </h1>
            </div>
          </div>

          <h1 className="text-4xl">{item.name}</h1>
          <h1 className="text-[22px] text-[#a4a4a4]">
            Priority {item.priority}
          </h1>

          <div className="w-full mt-4 gap-5 h-[60px] justify-between flex">
            <button
              onClick={() => {
                setShowAlert(true);
                setDeleteitems({ id: item.id, name: "banner" });
              }}
              className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-between gap-2 px-3 rounded-[8px] h-full "
            >
              Delete <MdDeleteOutline />
            </button>
            <button className="w-full py-2 cursor-pointer text-sky-800 border-2 border-sky-800 flex items-center justify-between gap-2 px-3 rounded-[8px] h-full ">
              Edit <CiEdit />
            </button>
          </div>
        </div>
      </div>
    ));

  return (
    <>
      <div className="w-full mt-6 h-full flex justify-center">
        <Container>
          <div className="w-full h-full gap-3 grid grid-cols-2">
            {Banner.length > 0 && <Allcatgory />}
          </div>
        </Container>
      </div>
    </>
  );
};

export default BannerSpace;
