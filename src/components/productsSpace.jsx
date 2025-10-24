import Container from "./container";
import { useStatment } from "../context/maping";
// import { table } from "@heroui/theme";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProductsTable from "./ProductsTable";
import ProductsCard from "./productsCard";
import axios from "axios";
const ProductsSpace = () => {
  const { setShowProduct, refresh } = useStatment();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [View, setView] = useState({
    table: true,
    view: false,
  });

  useEffect(() => {
    getProducts();
  }, [refresh]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/product`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  //  const {
  //     setShowAlert,
  //     setDeleteitems,
  //     setProductDetails,
  //     setEditShowProduct,
  //     refresh,
  //   } = useStatment();

  //   useEffect(() => {
  //     GetProducts();
  //   }, [refresh]);

  //   const GetProducts = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:4000/product");
  //       setProducts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //     const filteredOrders = products.filter((product) =>
  //     users[product.name]
  //       ? users[order.name].toLowerCase().includes(search.toLowerCase())
  //       : false
  //   );

  return (
    <>
      <div className="w-full  flex justify-center mt-5 h-[70px]">
        <Container>
          <div className="w-full h-full flex items-center flex-col">
            <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
              <div className="flex gap-1   h-full py-3  text-white items-center ">
                <button
                  onClick={() => {
                    setView({
                      table: false,
                      view: true,
                    });
                  }}
                  className={` ${
                    View.view
                      ? "bg-[#F2F2F2] text-[#000]"
                      : "hover:bg-[#f2f2f223]"
                  }  cursor-pointer px-4 py-2 rounded-md`}
                >
                  View
                </button>

                <button
                  onClick={() => {
                    setView({
                      table: true,
                      view: false,
                    });
                  }}
                  className={` ${
                    View.table
                      ? "bg-[#F2F2F2] text-[#000]"
                      : "hover:bg-[#f2f2f223]"
                  }  cursor-pointer px-4 py-2 rounded-md`}
                >
                  Table
                </button>
              </div>

              <div className="flex items-center text-[#000] gap-4">
                <button
                  onClick={() => {
                    setShowProduct(true);
                  }}
                  className="bg-[#F2F2F2] cursor-pointer px-4 py-2 rounded-md"
                >
                  Add Product
                </button>

                <div className="flex items-center relative">
                  <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 rounded-md bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="w-full h-full flex justify-center items-center">
        <Container>
          <div className="w-full h-full flex justify-center items-center">
            {View.table ? (
              <ProductsTable products={filteredProducts} />
            ) : (
              <ProductsCard products={filteredProducts} />
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProductsSpace;
