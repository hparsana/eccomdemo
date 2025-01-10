import Cookies from "js-cookie";

// export const LOCAL_PATH = "https://chatappreactnode-1.onrender.com/api/v1";
// export const SOCKET_URL = "https://chatappreactnode-1.onrender.com";
export const LOCAL_PATH = "https://eccomdemo.onrender.com/api/v1";
// export const LOCAL_PATH = "http://localhost:5000/api/v1";
// export const LOCAL_PATH = "http://192.168.29.162:5000/api/v1";

// export const LOCAL_PATH = "http://192.168.29.162:5000/api/v1";
// export const SOCKET_URL = "http://192.168.1.15:5000";

// let accessTokenFromStorage =
//   localStorage.getItem("accessToken") || Cookies.get("accessToken");
// export const headers = {
//   "Access-Control-Allow-Origin": "*",
//   "Content-type": "Application/json",
//   Authorization: `Bearer ${accessTokenFromStorage}`,
// };

export const USERS = {
  GET_USER_API: `${LOCAL_PATH}/user/get-userdata`,
  REGISTER_USER_API: `${LOCAL_PATH}/user/register`,
  VERIFY_USER_OTP: `${LOCAL_PATH}/user/verify-otp`,
  GET_USER_INFO: `${LOCAL_PATH}/user/get-userdata`,
  LOGIN_USER_API: `${LOCAL_PATH}/user/login`,
  LOGOUT_USER_API: `${LOCAL_PATH}/user/logout`,
  GET_ALL_USERS: `${LOCAL_PATH}/user/getallusers`,
  UPDATE_USER_INFO_BYADMIN: `${LOCAL_PATH}/user/updateoneuser`,
  GET_USER_ACTIVITY: `${LOCAL_PATH}/user/getuseractivity`,
  FORGOTPASSWORD: {
    VERIFYEMAIL: `${LOCAL_PATH}/user/forgotpassword/verifyemail`,
    VERIFYEMAILOTP: `${LOCAL_PATH}/user/forgotpassword/verifyemailotp`,
    VERIFYPASSWORD: `${LOCAL_PATH}/user/forgotpassword/verifypassword`,
  },
};

export const PRODUCTS = {
  GET_ALL_PRODUCTS: `${LOCAL_PATH}/product/getproducts`,
  GET_ONE_PRODUCTS: `${LOCAL_PATH}/product/getoneproduct`,
  ADD_PRODUCT: `${LOCAL_PATH}/product/addproduct`,
  UPDATE_PRODUCT: `${LOCAL_PATH}/product/updateoneproduct`,
  DELETE_PRODUCT: `${LOCAL_PATH}/product/deleteoneproduct`,

  // review
  ADD_REVIEW: `${LOCAL_PATH}/product/reviews`,
  UPDATE_REVIEW: `${LOCAL_PATH}/product`,
};

export const ORDERS = {
  GET_ALL_ORDERS: `${LOCAL_PATH}/order/getorders`, // Replace with your API endpoint
  ADD_ORDER: `${LOCAL_PATH}/order/createorder`,
  DELETE_ORDER: `${LOCAL_PATH}/order/deleteorder`,
  UPDATE_ORDER_STATUS: `${LOCAL_PATH}/order/updateorderstatus`,
  GET_DASHBOARD_STATITICS: `${LOCAL_PATH}/order/orderstats`,
  GET_DASHBOARD_PRODUCTSOLD: `${LOCAL_PATH}/order/productsold`,
};

export const SAVEDPRODUCT = {
  GET_ALL_SAVEDPRODUCTS: `${LOCAL_PATH}/savedproduct/getsavedproducts`, // Replace with your API endpoint
  ADD_SAVEDPRODUCTS: `${LOCAL_PATH}/savedproduct/addsaveproduct`,
  DELETE_SAVEDPRODUCTS: `${LOCAL_PATH}/savedproduct/removesavedproduct`,
};

export const CATEGORIES = {
  GET_ALL_CATEGORIES: `${LOCAL_PATH}/category`, // Matches the GET '/' route for all categories
  GET_ONE_CATEGORY: `${LOCAL_PATH}/category`, // Append `/:id` dynamically for a single category
  ADD_CATEGORY: `${LOCAL_PATH}/category`, // Matches the POST '/' route to add a category
  UPDATE_CATEGORY: `${LOCAL_PATH}/category`, // Append `/:id` dynamically for updating a category
  DELETE_CATEGORY: `${LOCAL_PATH}/category`, // Append `/:id` dynamically for deleting a category

  // Subcategories
  ADD_SUBCATEGORY: `${LOCAL_PATH}/category/subcategories`, // Append `/:categoryId/subcategories` dynamically
  UPDATE_SUBCATEGORY: `${LOCAL_PATH}/category`, // Append `/:categoryId/subcategories/:subcategoryId` dynamically
  DELETE_SUBCATEGORY: `${LOCAL_PATH}/category`, // Append `/:categoryId/subcategories/:subcategoryId` dynamically
};

export const ADDRESSES = {
  GET_ALL: `${LOCAL_PATH}/user/addresses`,
  ADD: `${LOCAL_PATH}/user/addresses`,
  UPDATE: `${LOCAL_PATH}/user/addresses/:addressId`,
  DELETE: `${LOCAL_PATH}/user/addresses/:addressId`,
};

export const ERROR_LOGS = {
  GET_ERROR_LOGS: `${LOCAL_PATH}/errorlogs/error-filelogs`, // Endpoint to fetch logs
};
