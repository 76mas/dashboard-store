import { createContext, useContext, useState } from "react";

const StateContext = createContext();

const EventProvider = ({ children }) => {
  const [active, setActive] = useState({
    Categorys: false,
    Products: false,
    Banners: false,
    Orders: true,
    Voucher: false,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [deleteitems, setDeleteitems] = useState({ id: null, name: null });
  const [refresh, setRefresh] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [showEditProduct, setEditShowProduct] = useState(false);
  const [showEditBanner, setEditShowBanner] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showDeleteItem, setShowDeleteItem] = useState(false); // [deleteItem]
  const [showEditOrderUserInfo, setShowEditOrderUserInfo] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [bannerId, setBannerId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [map, setMap] = useState([]);
  const [bannerType, setBannerType] = useState("single");
  const [voucherId, setVoucherId] = useState(null);
  return (
    <StateContext.Provider
      value={{
        active,
        setActive,
        showAlert,
        setShowAlert,
        deleteitems,
        setDeleteitems,
        refresh,
        setRefresh,
        showProduct,
        setShowProduct,
        productDetails,
        setProductDetails,
        showEditProduct,
        setEditShowProduct,
        showAddBanner,
        setShowAddBanner,
        bannerType,
        setBannerType,
        map,
        setMap,
        showEditBanner,
        setEditShowBanner,
        bannerId,
        setBannerId,
        showAddCategory,
        setShowAddCategory,
        categoryId,
        setCategoryId,
        showEditCategory,
        setShowEditCategory,
        orderId,
        setOrderId,
        showEditOrder,
        setShowEditOrder,
        orderDetails,
        setOrderDetails,
        showEditOrderUserInfo,
        setShowEditOrderUserInfo,
        showDeleteItem,
        setShowDeleteItem,
        showAddVoucher,
        setShowAddVoucher,
        voucherId,
        setVoucherId,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default EventProvider;
export const useStatment = () => useContext(StateContext);
