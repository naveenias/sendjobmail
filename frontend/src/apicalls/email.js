import { axiosInstance } from "./axiosInstance";


export const sendemail = async (payload) => {
    try {
      let res = await axiosInstance.post("/api/email/sendemail", payload);
      return res.data;
    }catch{
      return console.error("error");
    }
};