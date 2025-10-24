import { useStatment } from "../context/maping";
import { MdDeleteOutline } from "react-icons/md";
import { GrRedo } from "react-icons/gr";

import { IoAlertCircleOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

const DeleteItem = ({
  orderId, // هذا id المنتج داخل الطلب
  orderDetails,
  setOrderDetails,
  setShowDeleteItem,
  refresh,
  setRefresh,
}) => {
  const { id } = useParams(); // هذا هو ID الطلب نفسه من الرابط

  const updateOrderDetails = async () => {
    console.log("orderDetails", orderDetails);

    // إزالة المنتج من الطلب
    const DataSend = orderDetails.OrderDetails.filter(
      (item) => item.id !== orderId
    );

    console.log("data send", DataSend);

    try {
      const response = await axios.put(`http://localhost:4000/order/${id}`, {
        items: DataSend,
      });

      console.log("response", response);
      setShowDeleteItem(false);
      setOrderDetails((prev) => ({
        ...prev,
        OrderDetails: DataSend,
      }));
      setRefresh(!refresh);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          console.log("body clicked");
          setShowDeleteItem(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#000000a8] h-full"
      >
        <AnimatePresence>
          <motion.div
            key="alert-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 1, scale: 0.3, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 1, scale: 0.6, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            // className="w-[400px] h-[200px] bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-[400px] h-[200px] bg-[#ffffff09] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
            >
              <IoAlertCircleOutline className="text-[30px] text-[#ff0073cc]" />

              <h1 className="text-[#ddd]">
                هل أنت متأكد من حذف هذا العنصر؟
              </h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={updateOrderDetails}
                  className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-between gap-2 px-3 rounded-[8px] h-full"
                >
                  حذف <MdDeleteOutline />
                </button>
                <button
                  onClick={() => {
                    console.log("Cancel button clicked");
                    setShowDeleteItem(false);
                  }}
                  className="w-full py-2 cursor-pointer text-sky-800 border-2 border-sky-800 flex items-center justify-between gap-2 px-3 rounded-[8px] h-full"
                >
                  الغاء <GrRedo />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default DeleteItem;
