import { APIConstants } from "@/src/constants";
import { apiCall } from "./Api";

export const generateBillService = async () => {
    return apiCall("GET", APIConstants.ENDPOINTS.GENERATE_BILL_URL);
};

export const getBillForUserService = async (userId: string) => {
    const url = `${APIConstants.ENDPOINTS.GET_BILL_URL}/${userId}`;
    return apiCall("GET", url);
};
