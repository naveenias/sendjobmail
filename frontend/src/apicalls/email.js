import { axiosInstance } from "./axiosInstance";


export const sendemail = async (payload) => {
    try {
      const fullApiUrl = axiosInstance.defaults.baseURL + "/api/email/sendemail";
      console.log("Full API URL:", fullApiUrl); // Log full API URL
      let res = await axiosInstance.post("/api/email/sendemail", payload);
      console.log(res)
      return res.data;
    }catch{
      return console.error("error");
    }
};