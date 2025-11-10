import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { Table, Space, Button, ConfigProvider, theme, Tag, Switch } from "antd";
import Container from "@/components/container";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
// import { useStatment } from "@/context/maping";
import { MdOutlineDone } from "react-icons/md";
import { GrRedo } from "react-icons/gr";

import { IoAlertCircleOutline } from "react-icons/io5";

import { IoCloseOutline } from "react-icons/io5";

import { Select, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
const VoucherSpace = () => {
  const [refresh, setRefresh] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [voucherId, setVoucherId] = useState(null);

  const [loadingRows, setLoadingRows] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterVouocher, setFilterVoucher] = useState([]);

  useEffect(() => {
    if (vouchers.length === 0) {
      getAllVoucher();
    }
  }, []);

  useEffect(() => {
    getAllVoucher();
  }, [refresh]);

  const getAllVoucher = async () => {
    try {
      let res = await axios.get("https://mahmod.puretik.info/api/voucher");
      res = res.data.map((item) => ({
        ...item,
        create_at: item.create_at.split("T")[0],
        expire_date: item.expire_date.split("T")[0],
      }));
      setVouchers(res);
      setFilterVoucher(res);
    } catch (e) {
      console.log(e);
    }
  };

  const handelChangeActive = async (id, newActive) => {
    setLoadingRows((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.put(`https://mahmod.puretik.info/api/voucher/${id}`, {
        active: newActive,
      });
      getAllVoucher();
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilterVoucher(vouchers);
    } else {
      const filtered = vouchers.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilterVoucher(filtered);
    }
  }, [search, vouchers]);

  const AllVoucher = () => {
    const column = [
      {
        title: "الاسم",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "الكود",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "النوع",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "الحد الادنى للقيمة",
        dataIndex: "min_value",
        key: "min_value",
      },
      {
        title: "الحد الاقصى للخصم",
        dataIndex: "max_value",
        key: "max_value",
      },
      {
        title: "تاريخ الانتهاء",
        dataIndex: "expire_date",
        key: "expire_date",
      },
      {
        title: "الحالة",
        dataIndex: "active",
        key: "active",
        render: (_, record) => (
          <Space
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tag
              style={{
                width: "90px",
                textAlign: "center",
              }}
              color={record.active ? "green" : "red"}
            >
              {record.active ? "فعال" : "غير فعال"}
            </Tag>
          </Space>
        ),
      },
      {
        title: "تاريخ الإنشاء",
        dataIndex: "create_at",
        key: "create_at",
      },
      {
        title: "القيمة",
        dataIndex: "value",
        key: "value",
      },

      {
        title: "الإجراءات",
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <Space>
            <Button
              onClick={() => {
                setVoucherId(record.id);
                setShowAddVoucher(true);
              }}
              type="primary"
              icon={<CiEdit />}
            >
              تعديل
            </Button>
            <Button
              danger
              onClick={() => {
                // setDeleteitems({ id: record.id, name: "voucher" });
                setVoucherId(record.id);
                setShowAlert(true);
              }}
              icon={<MdDeleteOutline />}
            >
              حذف
            </Button>
            <Switch
              loading={loadingRows[record.id]}
              checked={record.active}
              onChange={(checked) => handelChangeActive(record.id, checked)}
              style={{
                background: record.active ? "green" : "",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              checkedChildren={<MdOutlineDone size={20} />}
              unCheckedChildren={<IoClose size={20} />}
            />
          </Space>
        ),
      },
    ];
    return (
      <>
        <Container>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
            }}
          >
            <Table columns={column} rowKey="id" dataSource={filterVouocher} />
          </ConfigProvider>
        </Container>
      </>
    );
  };

  return (
    <>
      <div className="w-full h-full flex items-center flex-col gap-3">
        <div className="w-full  flex justify-center mt-5 h-[70px]">
          <Container>
            <div className="w-full h-full flex items-center flex-col">
              <div className="w-full h-full p-2 flex flex-row-reverse justify-between bg-[#a0a0a022] border-1 border-[#d0cece5d] rounded-xl items-center">
                <button
                  onClick={() => {
                    setShowAddVoucher(true);
                  }}
                  className="bg-[#F2F2F2] cursor-pointer px-4 py-2 rounded-md"
                >
                  اضف قسيمة جديدة
                </button>

                <div className="flex items-center w-[400px] relative">
                  <FiSearch className="absolute left-3 text-white/50 text-lg pointer-events-none" />
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="ابحث عن قسيمة..."
                    className="pl-10 pr-4 py-2 rounded-md w-full bg-transparent border border-[#ffffff33] text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>
        <AnimatePresence>
          <motion.div
            key="alert-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full mt-3 flex justify-center"
          >
            <AllVoucher />
          </motion.div>
        </AnimatePresence>

        {showAddVoucher && (
          <AddVoucher
            setShowAddVoucher={setShowAddVoucher}
            voucherId={voucherId}
            refresh={refresh}
            setRefresh={setRefresh}
            setVoucherId={setVoucherId}
          />
        )}
        {showAlert && (
          <AlertDelete
            setShowAlert={setShowAlert}
            refresh={refresh}
            id={voucherId}
            setRefresh={setRefresh}
          />
        )}
      </div>
    </>
  );
};

export default VoucherSpace;

const AddVoucher = ({
  setShowAddVoucher,
  refresh,
  setRefresh,
  voucherId,
  setVoucherId,
}) => {
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
      const response = await axios.get(
        `https://mahmod.puretik.info/api/voucher/${id}`
      );
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
      await axios.post("https://mahmod.puretik.info/api/voucher", voucherInfo);
      setShowAddVoucher(false);
      setRefresh(!refresh);
      setVoucherId(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `hhttps://mahmod.puretik.info/api/voucher/${id}`,
        voucherInfo
      );
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
      className="w-full fixed z-40 flex -translate-y-22 items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="voucher-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0.4, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-[900px] min-h-[600px] py-12 bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <h1 className="text-2xl text-white">
            {id ? "تحديث قسيمة" : "اضف قسيمة جديدة"}
          </h1>

          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="grid text-white w-full grid-cols-2 px-6 items-center gap-3">
            <div className="flex text-white w-full flex-col items-center gap-3">
              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                اسم القسيمة:
                <input
                  value={voucherInfo.name}
                  onChange={(e) =>
                    setVoucherInfo({ ...voucherInfo, name: e.target.value })
                  }
                  type="text"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="اسم القسيمة"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                نوع القسيمة:
                <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                  <Select
                    onChange={(e) => {
                      setTypeVoucher(e);
                      setVoucherInfo({ ...voucherInfo, type: e });
                    }}
                    value={typeVoucher}
                    style={{ height: "50px", width: "100%" }}
                  >
                    <Select.Option value="num">قيمة نقدية</Select.Option>
                    <Select.Option value="per">نسبة</Select.Option>
                  </Select>
                </ConfigProvider>
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                اصغر قيمة مسموح بها:
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
              {voucherInfo.type === "per" && (
                <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                  اكبر قيمة مسموح بها للخصم:
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
                    placeholder="اكبر قيمة مسموح بها للخصم"
                  />
                </label>
              )}
            </div>

            <div className="flex text-white w-full flex-col justify-center items-center gap-3">
              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                {voucherInfo.type === "num"
                  ? "  قيمة  حصم القسيمة:"
                  : " % حدد نسبة خصم من الاوردر"}

                <input
                  value={voucherInfo.value}
                  onChange={(e) => {
                    if (voucherInfo.type == "per" && e >= 100) {
                      alert("the value must be less than 100");
                      return;
                    }
                    setVoucherInfo({ ...voucherInfo, value: e.target.value });
                  }}
                  type="number"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Value"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                كود القسيمة:
                <input
                  value={voucherInfo.code}
                  onChange={(e) =>
                    setVoucherInfo({ ...voucherInfo, code: e.target.value })
                  }
                  type="text"
                  className="h-full w-full border-[#ffffff4e] outline-0 border pl-2 rounded-[8px]"
                  placeholder="Code"
                />
              </label>

              <label className="flex text-[#a4a4a4] flex-col h-[80px] w-full px-2 gap-2">
                تاريخ انتهاء القسيمة:
                <Form.Item>
                  <ConfigProvider
                    style={{ height: "50px", width: "100%" }}
                    theme={{ algorithm: theme.darkAlgorithm }}
                  >
                    <DatePicker
                      placeholder="حدد التاريخ"
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
                {id ? "تحديث" : "اضف"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AlertDelete = ({ id, setShowAlert, refresh, setRefresh }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`https://mahmod.puretik.info/api/voucher/${id}`);
      setShowAlert(false);

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
      className="w-full z-40 fixed flex -translate-y-20  items-center justify-center bg-[#000000a8] h-full"
    >
      <AnimatePresence>
        <motion.div
          key="alert-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-[400px] h-[200px] bg-[#ffffff09] border border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center justify-center gap-3"
        >
          <IoAlertCircleOutline className="text-[30px] text-[#ff0073cc]" />

          <h1 className="text-[#ddd] text-center">
            هل أنت متأكد من حذف هذه القسيمة؟
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
