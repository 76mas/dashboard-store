import { useEffect, useState } from "react";
import { useStatment } from "../context/maping";
import { ConfigProvider, Select, theme, InputNumber, Input } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
//  refresh={}         ={setRefresh}
const EdtUserOrderInfo = ({ setRefresh, refresh }) => {
  const { setShowEditOrderUserInfo } = useStatment();
  //   const [order, setOrder] = useState({});
  const [orderEdit, setOrderEdit] = useState({
    phone: "",
    address: "",
    status: "",
  });

  const { id } = useParams();
  useEffect(() => {
    getOrderbyId();
  }, []);

  const getOrderbyId = async () => {
    try {
      const order = await axios.get(`http://161.97.169.6:4000/order/${id}`);

      //   setOrder(order.data);
      setOrderEdit({
        phone: order.data.phone,
        address: order.data.address,
        status: order.data.status,
      });
      // setOrderDetails(order.data);
      // console.log("sss",order.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditOrder = async () => {
    try {
      await axios.put(`http://161.97.169.6:4000/order/${id}`, orderEdit);

      setShowEditOrderUserInfo(false);
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setShowEditOrderUserInfo(false);
        }}
        className="w-full z-40 fixed flex items-center justify-center bg-[#00000033] backdrop-blur-sm h-full"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[900px]  h-[600px] py-12 no-scrollbar  bg-[#141d2d] border-1 border-[#ffffff1c] backdrop-blur-2xl shadow-md rounded-2xl flex flex-col items-center gap-3"
        >
          <h1 className="text-2xl text-white">تعديل معلومات الطلب</h1>

          <div className="w-full h-[1px] bg-[#ffffff4e]" />

          <div className="w-full h-full flex flex-col justify-center  px-3  gap-4 items-center ">
            <div className="flex  text-white w-full   justify-center  items-center gap-3">
              <div className="flex text-white w-full flex-col justify-center items-center gap-3">
                {/* <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-[90%]  gap-2"
                >
                  order Quantaty :
                  <ConfigProvider
                    className="w-full   flex items-center justify-center"
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <InputNumber
                      style={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        border: "1px solid #ffffff4e",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                 
                    
                    />
                  </ConfigProvider>
                </label> */}

                <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-[90%]  gap-2"
                >
                  رقم الهاتف:
                  <ConfigProvider
                    className="w-full   flex items-center justify-center"
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <Input
                      style={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        border: "1px solid #ffffff4e",
                        display: "flex",
                        alignItems: "center",
                      }}
                      value={orderEdit?.phone}
                      onChange={(e) => {
                        setOrderEdit({ ...orderEdit, phone: e.target.value });
                      }}
                      placeholder="phone number"
                    />
                  </ConfigProvider>
                </label>

                <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-[90%]  gap-2"
                >
                  العنوان:
                  <ConfigProvider
                    className="w-full   flex items-center "
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <Input
                      style={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        border: "1px solid #ffffff4e",
                        display: "flex",
                        alignItems: "center",
                      }}
                      value={orderEdit?.address}
                      onChange={(e) => {
                        setOrderEdit({ ...orderEdit, address: e.target.value });
                      }}
                      placeholder="Address"
                    />
                  </ConfigProvider>
                </label>

                <label
                  htmlFor="price"
                  className=" flex text-[#a4a4a4] flex-col h-[80px]  w-[90%]  gap-2"
                >
                  حالة الطلب:
                  <ConfigProvider
                    className="w-full   flex items-center justify-center"
                    theme={{
                      algorithm: theme.darkAlgorithm,
                    }}
                  >
                    <Select
                      style={{
                        width: "100%",
                        height: "50px",
                        backgroundColor: "transparent",
                        borderRadius: "8px",
                        border: "1px solid #ffffff4e",
                        display: "flex",
                        alignItems: "center",
                      }}
                      defaultValue={orderEdit?.status}
                      value={orderEdit?.status}
                      onChange={(e) => {
                        setOrderEdit({ ...orderEdit, status: e });
                      }}
                      options={[
                        { value: "cancelled", label: "ملغاة" },
                        { value: "delivered", label: "تم التوصيل" },
                        { value: "shipped", label: "تم الشحن" },
                        { value: "pending", label: "قيد الانتظار" },
                      ]}
                    />
                  </ConfigProvider>
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                handleEditOrder();
              }}
              className="bg-[#F2F2F2]  hover:bg-[#f2f2f2dd] h-[50px] w-[90%] text-[#000] cursor-pointer px-4 py-2 rounded-md"
            >
              حفظ التعديلات
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EdtUserOrderInfo;
