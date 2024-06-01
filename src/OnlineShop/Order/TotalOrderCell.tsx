import React from "react";
import useGetVoucherDiscount from "../hooks/useGetVoucher";
interface order {
  productId: number;
  product: getoption;
  quantity: number;
  price: number;
  discount: number;
}
interface getoption {
  id: number;
  name: string;
  price: number;
}
const TotalOrderCell = ({
  orderDetails,
  voucherId,
}: {
  orderDetails: order[];
  voucherId: number | undefined;
}) => {
  const voucherDiscount = useGetVoucherDiscount(voucherId);

  const totalOrder = orderDetails.reduce((total, value) => {
    return (
      total + value.product?.price * (1 - value.discount / 100) * value.quantity
    );
  }, 0);

  // Apply the voucher discount if available
  const totalOrderAfterVoucher = voucherDiscount
    ? totalOrder * (1 - voucherDiscount / 100)
    : totalOrder;

  // Round and format the total order
  const formattedTotalOrder = totalOrderAfterVoucher.toFixed(0);

  return <>{`${formattedTotalOrder}đ`}</>;
};

export default TotalOrderCell;
