import { useEffect, useState } from "react";
// import { useStatment } from "../context/maping";
import Container from "./container";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [active, setActive] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // setActive({
    //   Categorys: true,
    //   Products: false,
    //   Banners: false,
    //   Orders: false,
    //   Voucher: false,
    // });
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/dashboard"
    ) {
      setActive({
        Categorys: false,
        Products: false,
        Banners: false,
        Orders: true,
      });
      navigate("/orders");
    } else if (window.location.pathname === "/category") {
      setActive({ Categorys: true, Products: false, Banners: false });
    } else if (window.location.pathname === "/product") {
      setActive({ Categorys: false, Products: true, Banners: false });
    } else if (window.location.pathname === "/banner") {
      setActive({ Categorys: false, Products: false, Banners: true });
    } else if (window.location.pathname === "/orders") {
      setActive({
        Categorys: false,
        Products: false,
        Banners: false,
        Orders: true,
      });
    } else if (window.location.pathname === "/voucher") {
      setActive({
        Categorys: false,
        Products: false,
        Banners: false,
        Voucher: true,
      });
    }
  }, [window.location.pathname, window.location.reload]);

  return (
    <>
      <div className="w-full h-[80px]  border-b-1 border-[#d0cece5d] flex justify-center items-center">
        <Container>
          <div className="w-full h-full flex justify-between items-center">
            <div className="flex items-center text-[#fff] gap-4">
              <button
                onClick={() => {
                  setActive({
                    Categorys: true,
                    Products: false,
                    Banners: false,
                    Orders: false,
                    Voucher: false,
                  });
                  navigate("/category");
                }}
                className={` ${
                  active.Categorys
                    ? "bg-[#F2F2F2] text-[#000]"
                    : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                الفئات
              </button>

              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: true,
                    Banners: false,
                    Orders: false,
                    Voucher: false,
                  });
                  navigate("/product");
                }}
                className={` ${
                  active.Products
                    ? "bg-[#F2F2F2] text-[#000]"
                    : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                المنتجات
              </button>

              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: false,
                    Banners: true,
                    Orders: false,
                    Voucher: false,
                  });
                  navigate("/banner");
                }}
                className={` ${
                  active.Banners
                    ? "bg-[#F2F2F2] text-[#000]"
                    : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                البانرات
              </button>
              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: false,
                    Banners: false,
                    Orders: false,
                    Voucher: true,
                  });
                  navigate("/voucher");
                }}
                className={`  ${
                  active.Voucher
                    ? "bg-[#F2F2F2] text-[#000]"
                    : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                القسائم
              </button>
              <button
                onClick={() => {
                  setActive({
                    Categorys: false,
                    Products: false,
                    Banners: false,
                    Orders: true,
                    Voucher: false,
                  });
                  navigate("/orders");
                }}
                className={`  ${
                  active.Orders
                    ? "bg-[#F2F2F2] text-[#000]"
                    : "hover:bg-[#f2f2f223]"
                }  cursor-pointer px-4 py-2 rounded-md`}
              >
                الطلبات
              </button>
            </div>

            <div>
              <h1 className="text-4xl text-white">لوحة التحكم</h1>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
