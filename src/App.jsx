import "./App.css";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import AddProduct from "./components/addProduct";
import AlertDelete from "./components/alertDelete";
import Header from "./components/header";
import MapHeader from "./components/mapheader";
import OrderSpace from "./pages/orderSpace";
import ProductsSpace from "./pages/productSpace";
import EditProduct from "./components/editProduct";
import CategoryTapble from "./pages/categorySpace";
import AddBanner from "./components/addBanner";
import EditBanner from "./components/editBanner";
import AddCategory from "./components/addCategory";
import EditCategory from "./components/editCategory";
import EditOrder from "./components/editOrder";
import EditOrderPage from "./pages/editOrderPage";
import AddVoucher from "./components/addVoucher";
import BannerTable from "./pages/bannerSpace";
import OrdersTable from "./pages/orderSpace";
import VoucherSpace from "./pages/voucherSpace";
import Login from "./pages/Login";

function App() {
  const location = useLocation();

  const hideHeader =
    location.pathname.startsWith("/editOrder") ||
    location.pathname.startsWith("/login");

  return (
    <div className="w-full relative h-full flex flex-col items-center min-h-screen bg-[#141414]">
      {!hideHeader && <Header />}

      <Routes>
        {/* 👇 هذا السطر يخلي صفحة /login هي الافتراضية */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/editOrder/:id" element={<EditOrderPage />} />
        <Route path="/voucher" element={<VoucherSpace />} />
        <Route path="/order" element={<OrderSpace />} />
        <Route path="/banner" element={<BannerTable />} />
        <Route path="/product" element={<ProductsSpace />} />
        <Route path="/category" element={<CategoryTapble />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
