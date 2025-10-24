import Container from "./container";
import { useStatment } from "../context/maping";
const MapHeader = () => {
  const { active, setActive } = useStatment();
  return (
    <>
      <div className="w-full  flex justify-center mt-5 h-[70px]">
        <Container>
          <div className="w-full h-full py-2 flex justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
            <div className="flex gap-4  h-full py-3 px-4 text-white items-center ">
              <button
                onClick={() => {
                  setActive({
                    Categorys: true,
                    Products: false,
                    Banners: false,
                    Orders: false,
                  });
                }}
                className={` ${
                  active.Categorys ? "bg-[#F2F2F2] text-[#000]" : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                Categorys
              </button>

              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: true,
                    Banners: false,
                    Orders: false,
                  });
                }}
                className={` ${
                  active.Products ? "bg-[#F2F2F2] text-[#000]" : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                Products
              </button>

              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: false,
                    Banners: true,
                    Orders: false,
                  });
                }}
                className={` ${
                  active.Banners ? "bg-[#F2F2F2] text-[#000]" : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                Banners
              </button>

              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: false,
                    Banners: false,
                    Orders: true,
                  });
                }}
                className={`  ${
                  active.Orders ? "bg-[#F2F2F2] text-[#000]" : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                Orders
              </button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default MapHeader;
