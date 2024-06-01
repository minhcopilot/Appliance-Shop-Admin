import { useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";

const useGetVoucherDiscount = (voucherId: number | undefined) => {
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (voucherId) {
      axiosClient
        .get(`/vouchers/${voucherId}`)
        .then((response) => {
          setDiscountPercentage(response.data.discountPercentage);
        })
        .catch((error) => {
          console.error("Error fetching voucher discount:", error);
        });
    }
  }, [voucherId]);
  return discountPercentage;
};

export default useGetVoucherDiscount;
