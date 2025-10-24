import Container from "./container";
import { useEffect, useState } from "react";
import axios from "axios";
import { BiCategoryAlt } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useStatment } from "../context/maping";
const CategorySpace = () => {
  const [categorys, setCategorys] = useState([]);
  const [products, setProducts] = useState([]);
  const { setShowAlert, setDeleteitems } = useStatment();

  useEffect(() => {
    GetCategory();
    GetAllProducts();
  }, []);

  const GetCategory = async () => {
    try {
      const res = await axios.get("http://localhost:4000/category");
      console.log(res.data);
      setCategorys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const GetAllProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/product`);
      console.log(res.data);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const Allcatgory = () =>
    categorys.map((item, index) => (
      <div
        key={index}
        className="w-full h-[200px] text-white bg-[#282828] border-1 border-[#ffffff4e] rounded-2xl  flex flex-col p-5"
      >
        <div className="w-full h-full flex flex-col justify-around">
          <div className="w-full h-[80px] flex justify-between items-center">
            <div className="w-[30px]  rounded-[8px] items-center h-[30px] border-1 border-[#aa92f7] flex justify-center">
              <BiCategoryAlt className="text-[20px] text-[#d6cef0]" />
            </div>

            {/* <div className="border-1 border-[#ffffff4a] w-[90px] h-[40px] flex items-center justify-center  rounded-[8px]">
              <h1 className="text-[10px] flex justify-center items-center">
                products :{" "}
                {
                  products.filter((product) => product.category_id === item.id)
                    .length
                }
              </h1>
            </div> */}

            <div className="border-1 border-[#ffffff4a]   w-[130px] h-[40px] flex items-center justify-center  rounded-[8px]">
              <h1 className="text-[15px] flex gap-3 text-[#a4a4a4] justify-center items-center">
                products :{" "}
                <span className="text-[#ffff] text-lg">
                  {" "}
                  {
                    products.filter(
                      (product) => product.category_id === item.id
                    ).length
                  }
                </span>
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
                setDeleteitems({ id: item.id, name: "category" });
                setShowAlert(true);
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
      <div className="w-full  mt-6 h-full flex justify-center">
        <Container>
          <div className="w-full h-full gap-3 grid grid-cols-2">
            {categorys.length > 0 && <Allcatgory />}
          </div>
        </Container>
      </div>
    </>
  );
};

export default CategorySpace;
