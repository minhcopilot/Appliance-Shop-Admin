import axiosClient from "../config/axiosClient";

export const uniqBy = (array: any[]) => {
  let seen = new Set();
  return array.filter((item) => {
    let k = JSON.stringify(item);
    return seen.has(k) ? false : seen.add(k);
  });
};
export const checkUnique = async (subject: string, data: any) => {
  try {
    const response = await axiosClient.post(subject + "/check-unique", data);
    if (response.data.length > 0) {
      return Promise.reject(new Error("This " + subject + " is already exist"));
    } else {
      return Promise.resolve();
    }
  } catch (error: any) {
    console.log(error.response.data.message);
    return Promise.resolve(new Error(error.response.data.message));
  }
};
