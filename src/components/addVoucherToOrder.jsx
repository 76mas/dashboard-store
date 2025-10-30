import { use, useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Select, theme, ConfigProvider, InputNumber } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const AddVoucherToOrder = ({
  setShowAddVoucherToOrder,
  refresh,
  setRefresh,
  totalPrice,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [order, setOrder] = useState({});
  const [user_id, setUser_id] = useState(null);
  const [coupon, setCoupon] = useState(null);
  //   const [orderDetails, setOrderDetailse] = useState({});
  const [loading, setLoading] = useState(false);
  //   const [persnateValue, setPersnateValue] = useState(0);
  const [voucher, setVoucher] = useState(null);
  //   const [discount, setDiscount] = useState(0);

  const { id } = useParams();

  useEffect(() => {
    GetVouchers();
    GetOrder();
  }, []);

  const GetOrder = async () => {
    try {
      const response = await axios.get(`http://161.97.169.6:4000/order/${id}`);
      setOrder(response.data);
      console.log("orderdddddd", response.data);
      setUser_id(response.data.user_id);
    } catch (e) {
      console.log(e);
    }
  };

  const GetVouchers = async () => {
    try {
      const response = await axios.get("http://161.97.169.6:4000/voucher");
      setVouchers(response.data);
      console.log("vouchers", response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateOrderWithVoucher = async (voucher, voucher_id) => {
    setLoading(true);
    if (!voucher) {
      alert("Please select a voucher");
      return;
    }
    try {
      const res = await axios.put(`http://161.97.169.6:4000/order/${id}`, {
        ...order,
        voucher_info: voucher,
        voucher_id: voucher_id,
      });

        setLoading(false);
        setRefresh(!refresh);
        setShowAddVoucherToOrder(false);
      console.log("res affter apply voucher", res.data);
    } catch (err) {
      console.log(err);
    }
  };
  //   function handelSumPrice(orders) {
  //     let sum = 0;

  //     for (let i = 0; i < orders?.length; i++) {
  //       if (orders[i].endpricedate >= new Date().toISOString().split("T")[0]) {
  //         sum += orders[i].endprice * orders[i].quantity;
  //       } else {
  //         sum += orders[i].price * orders[i].quantity;
  //       }
  //     }
  //     return sum;
  //   }

  const handelApplayCoupon = async () => {
    if (!coupon) {
      alert("Please select a voucher");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`http://161.97.169.6:4000/voucher/check`, {
        code: coupon,
        user: user_id,
      });

      console.log("res voucher", res.data);
      console.log("totalPrice", totalPrice);

      if (totalPrice < res.data.min_value) {
        alert("The minimum value to use this voucher is " + res.data.min_value);
        return;
      } else {
        console.log("res voucher", res.data);
        // setVoucher(res.data);

        await handleUpdateOrderWithVoucher(res.data, res.data.id);
      }

      setLoading(false);
    } catch (err) {
      //    alert(err.response.data.message.error);
      alert(err.response.data.error);
      setShowAddVoucherToOrder(false);
      setLoading(false);
    }
  };

  const handelSelectCoupon = (value) => {
    setCoupon(value);
  };

  console.log("coupon", coupon);
  console.log("voucher", voucher);

  return (
    <div
      onClick={() => {
        setShowAddVoucherToOrder(false);
      }}
      className="w-full fixed z-40 flex items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="voucher-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0.4, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[900px] min-h-[600px] py-12 bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center gap-3"
        >
          <h1 className="text-2xl text-white">اضف قسيمة</h1>
          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="flex text-white w-[70%] flex-col     justify-center h-full min-h-[400px] gap-3">
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
              <Select
                showSearch
                options={vouchers.map((v) => ({
                  value: v.code,
                  label: v.code,
                }))}
                onSelect={handelSelectCoupon}
                style={{ width: "100%", height: "50px" }}
                placeholder="Search and select a product"
                filterOption={false}
              ></Select>
            </ConfigProvider>

            <button
              //   onClick={handelAdd}
              onClick={handelApplayCoupon}
              className="bg-[#F2F2F2] active:scale-95 hover:bg-[#f2f2f2dd] h-[50px] w-[100%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
            >
              طبق الخصم
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddVoucherToOrder;

//اختبر الvoucher الخاص باليوزر
