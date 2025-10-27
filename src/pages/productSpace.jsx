import Container from "@/components/container";
import { useStatment } from "../context/maping";
// import { table } from "@heroui/theme";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ProductsTable from "@/components/ProductsTable";
import ProductsCard from "@/components/productsCard";
import axios from "axios";
import AddProduct from "@/components/addProduct";
import { Delete } from "lucide-react";

const ProductsSpace = () => {
  // const { setShowProduct, refresh } = useStatment();
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [ShowDelete, setShowDelete] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  // const [ShowEdit, setShowEdit] = useState(false);
  // const [productDetails, setProductDetails] = useState({});
  const [deleteitems, setDeleteitems] = useState({ id: null, name: null });
  const [products, setProducts] = useState([]);
  const [ShowAddProduct, setShowAddProduct] = useState(false);
  const [View, setView] = useState({
    table: true,
    view: false,
  });

  useEffect(() => {
    if (ShowAddProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [ShowAddProduct]);

  useEffect(() => {
    getProducts();
  }, [refresh, page, search]);

  const getProducts = async () => {
    try {
      const res = await axios.get("http://161.97.169.6:4000/product", {
        params: { page, limit, search },
      });

      setProducts(res.data.products);
      setTotal(res.data.total);
      console.log("products  page", res.data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  return (
    <>
      <div className="w-full  flex justify-center mt-5 h-[70px]">
        <Container>
          <div className="w-full h-full flex items-center flex-col">
            <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
              <div className="flex gap-1   h-full py-3  text-white items-center ">
                {/* <button
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
                </button> */}

                <button
                  onClick={() => {
                    // setShowProduct(true);
                    setShowAddProduct(true);
                    document.body.style.overflow = "hidden";
                  }}
                  className="bg-[#F2F2F2] text-[#000] cursor-pointer px-4 py-2 rounded-md"
                >
                  اضف منتج
                </button>
              </div>

              <div className="flex items-center text-[#000] gap-4">
                <div className="flex items-center relative">
                  <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="pl-10 pr-4 py-2 rounded-md w-[400px] bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="w-full h-full mt-6 flex justify-center items-center">
        <Container>
          <div className="w-full h-full flex justify-center items-center">
            <ProductsTable
              products={products}
              refresh={refresh}
              setRefresh={setRefresh}
              total={total}
              page={page}
              limit={limit}
              setPage={setPage}
            />
          </div>
        </Container>

        {ShowAddProduct && (
          <AddProduct
            refresh={refresh}
            setRefresh={setRefresh}
            setShowAddProduct={setShowAddProduct}
          />
        )}
      </div>
    </>
  );
};

export default ProductsSpace;
