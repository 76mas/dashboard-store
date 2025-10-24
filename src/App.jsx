import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import AddProduct from "./components/addProduct";
import AlertDelete from "./components/alertDelete";
import Header from "./components/header";
import MapHeader from "./components/mapheader";
import OrderSpace from "./pages/orderSpace";
// import ProductsSpace from "./productsSpace";
import ProductsSpace from "./pages/productSpace";
import EditProduct from "./components/editProduct";
// import BannerTable from "./components/bannerTable";
// import CategoryTapble from "./components/categoryTapble";
import CategoryTapble from "./pages/categorySpace";
import AddBanner from "./components/addBanner";
import EditBanner from "./components/editBanner";
import AddCategory from "./components/addCategory";
import EditCategory from "./components/editCategory";
import EditOrder from "./components/editOrder";
import EditOrderPage from "./pages/editOrderPage";
// import VoucherSpace from "./components/voucherSpace";
import AddVoucher from "./components/addVoucher";
// import OrdersTable from "./components/oorderSpace";
import BannerTable from "./pages/bannerSpace";
import OrdersTable from "./pages/orderSpace";
import VoucherSpace from "./pages/voucherSpace";
// function HomePage() {
//   const {
//     active,
//     showAlert,
//     showProduct,
//     showEditProduct,
//     showAddBanner,
//     showEditBanner,
//     showEditCategory,
//     showEditOrder,
//     showAddCategory,
//     showAddVoucher,
//   } = useStatment();

//   function SwetchCase() {
//     if (active.Categorys) {
//       return <CategoryTapble />;
//     } else if (active.Products) {
//       return <ProductsSpace />;
//     } else if (active.Banners) {
//       return <BannerTable />;
//     } else if (active.Orders) {
//       return <OrdersTable />;
//     }

//     // else if (active.Voucher) {
//     //   return <VoucherSpace />;
//     // }
//   }

//   return (
//     <div className="w-full relative pb-32 h-full flex justify-center min-h-screen bg-[#141414]">
//       <div className="w-full h-full  flex flex-col items-center">
//         {/* <Header /> */}
//         {/* <MapHeader /> */}
//         {showAlert && <AlertDelete />}
//         {showProduct && <AddProduct />}
//         {showEditProduct && <EditProduct />}
//         {showAddBanner && <AddBanner />}
//         {showEditBanner && <EditBanner />}
//         {showAddCategory && <AddCategory />}
//         {showEditCategory && <EditCategory />}
//         {showEditOrder && <EditOrder />}
//         {showAddVoucher && <AddVoucher />}
//         <SwetchCase />
//       </div>
//     </div>
//   );
// }

function App() {
  const location = useLocation();

  // نتحقق إذا المسار يحتوي على /editOrder
  const hideHeader = location.pathname.startsWith("/editOrder");
  return (
    <div className="w-full relative  h-full flex flex-col items-center min-h-screen bg-[#141414]">
      {" "}
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/editOrder/:id" element={<EditOrderPage />} />
        <Route path="/voucher" element={<VoucherSpace />} />
        <Route path="/order" element={<OrderSpace />} />
        <Route path="/banner" element={<BannerTable />} />
        <Route path="/product" element={<ProductsSpace />} />
        <Route path="/category" element={<CategoryTapble />} />
      </Routes>
    </div>
  );
}

export default App;
