import { MdDeleteOutline } from "react-icons/md";
import { GrRedo } from "react-icons/gr";

import { IoAlertCircleOutline } from "react-icons/io5";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AlertDelete = ({
  setShowAlert,
  setRefresh,
  refresh,
  deleteitems,
  setDeleteitems,
}) => {
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/${deleteitems.name}/${deleteitems.id}`
      );
      setShowAlert(false);
      setDeleteitems({ id: null, name: null });
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      onClick={() => {
        setShowAlert(false);
      }}
      className="w-full z-40 fixed top-0  flex items-center justify-center bg-[#000000a8] h-screen"
    >
      <AnimatePresence>
        <motion.div
          key="alert-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[400px] h-[200px] bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <IoAlertCircleOutline className="text-[30px] text-[#ff0073cc]" />

          <h1 className="text-[#ddd] text-center">
هل أنت متأكد من حذف هذا العنصر؟
          </h1>

          <div className="flex items-center gap-3 w-[85%]">
            <button
              onClick={handleDelete}
              className="w-full py-2 cursor-pointer border-[#ff0073cc] border-2 text-[#ff0073cc] flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#ff00731c] transition-all duration-200"
            >
              حذف <MdDeleteOutline />
            </button>

            <button
              onClick={() => setShowAlert(false)}
              className="w-full py-2 cursor-pointer text-sky-800 border-2 border-sky-800 flex items-center justify-center gap-2 px-3 rounded-[8px] hover:bg-[#1e90ff22] transition-all duration-200"
            >
              الغاء <GrRedo />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AlertDelete;
