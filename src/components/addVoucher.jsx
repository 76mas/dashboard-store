import { useEffect, useState } from "react";
import { useStatment } from "../context/maping";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Select, theme, ConfigProvider, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

const AddVoucher = () => {
  const { setShowAddVoucher, voucherId, setVoucherId } = useStatment();
  const [typeVoucher, setTypeVoucher] = useState("num");
  let id = Number(voucherId);
  const [voucherInfo, setVoucherInfo] = useState({
    name: "",
    code: "",
    type: typeVoucher,
    min_value: 0,
    max_value: null,
    expire_date: null,
    is_first: false,
    value: 0,
  });

  useEffect(() => {
    if (id) fetchVoucherById();
  }, [id]);

  const fetchVoucherById = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/voucher/${id}`);
      const voucherData = response.data;

      setVoucherInfo({
        name: voucherData.name || "",
        code: voucherData.code || "",
        type: voucherData.type || "num",
        min_value: voucherData.min_value || 0,
        max_value: voucherData.max_value,
        expire_date: voucherData.expire_date
          ? dayjs(voucherData.expire_date)
          : null,
        is_first: voucherData.is_first || false,
        value: voucherData.value || 0,
      });

      setTypeVoucher(voucherData.type || "num");
    } catch (error) {
      console.error("Error fetching voucher by id", error);
    }
  };

  const handleAdd = async () => {
    if (
      voucherInfo.name === "" ||
      voucherInfo.code === "" ||
      voucherInfo.min_value <= 0 ||
      voucherInfo.value <= 0
    ) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post("http://localhost:4000/voucher", voucherInfo);
      setShowAddVoucher(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:4000/voucher/${id}`, voucherInfo);
      setShowAddVoucher(false);
    } catch (err) {
      console.error("Error updating voucher", err);
    }
  };

  return (
    <div
      onClick={() => {
        setVoucherId(null);
        setShowAddVoucher(false);
      }}
      className="w-full fixed z-40 flex items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="voucher-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: .4, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[900px] min-h-[600px] py-12 bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <h1 className="text-2xl text-white">
            {id ? "Edit Voucher" : "Add Voucher"}
          </h1>

          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="grid text-white w-full grid-cols-2 px-6 items-center gap-3">
            <div className="flex text-white w-full flex-col items-center gap-3">
              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Voucher Name:
                <input
                  value={voucherInfo.name}
                  onChange={(e) =>
                    setVoucherInfo({ ...voucherInfo, name: e.target.value })
                  }
                  type="text"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Voucher Name"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Voucher Type:
                <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                  <Select
                    onChange={(e) => {
                      setTypeVoucher(e);
                      setVoucherInfo({ ...voucherInfo, type: e });
                    }}
                    value={typeVoucher}
                    style={{ height: "50px", width: "100%" }}
                  >
                    <Select.Option value="num">Number</Select.Option>
                    <Select.Option value="per">Percent</Select.Option>
                  </Select>
                </ConfigProvider>
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Min Value IQD:
                <input
                  value={voucherInfo.min_value}
                  onChange={(e) =>
                    setVoucherInfo({
                      ...voucherInfo,
                      min_value: e.target.value,
                    })
                  }
                  type="number"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Min Value"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Max Value:
                <input
                  value={voucherInfo.max_value || ""}
                  onChange={(e) =>
                    setVoucherInfo({
                      ...voucherInfo,
                      max_value: e.target.value,
                    })
                  }
                  type="number"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Max Value"
                />
              </label>
            </div>

            <div className="flex text-white w-full flex-col justify-center items-center gap-3">
              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Value IQD:
                <input
                  value={voucherInfo.value}
                  onChange={(e) =>
                    setVoucherInfo({ ...voucherInfo, value: e.target.value })
                  }
                  type="number"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Value"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Voucher Code:
                <input
                  value={voucherInfo.code}
                  onChange={(e) =>
                    setVoucherInfo({ ...voucherInfo, code: e.target.value })
                  }
                  type="text"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Voucher Code"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                Expired Date:
                <Form.Item>
                  <ConfigProvider
                    style={{ height: "50px", width: "100%" }}
                    theme={{ algorithm: theme.darkAlgorithm }}
                  >
                    <DatePicker
                      style={{ height: "50px", width: "100%" }}
                      onChange={(e) =>
                        setVoucherInfo({ ...voucherInfo, expire_date: e })
                      }
                      value={voucherInfo.expire_date}
                    />
                  </ConfigProvider>
                </Form.Item>
              </label>

              <button
                onClick={id ? handleUpdate : handleAdd}
                className="bg-[#F2F2F2] hover:bg-[#f2f2f2dd] h-[50px] w-[96%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
              >
                {id ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AddVoucher;
