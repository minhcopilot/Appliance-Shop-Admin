import React, { useEffect, useState } from "react";
import styles from "./Order.module.css";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Spin,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import type { ColumnsType } from "antd/es/table";
import { AiOutlineDelete } from "react-icons/ai";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects from "../hooks/useGet";
import { uniqBy } from "../hooks/usefulHooks";
import useGetVoucherDiscount from "../hooks/useGetVoucher";
import TotalOrderCell from "./TotalOrderCell";
// type Props = {};

dayjs.extend(customParseFormat);
dayjs.extend(utc);
const timeFormat = "HH:mm";
const dateFormat = "DD/MM/YYYY " + timeFormat;

interface getoption {
  id: number;
  name: string;
}
interface getpeople {
  id: number;
  firstName: string;
  lastName?: string;
}
interface product {
  id: number;
  name: string;
  price: number;
  discount: number;
}
interface order {
  productId: number;
  product: getoption;
  quantity: number;
  price: number;
  discount: number;
}
interface addschemaInput {
  createdDate: string;
  shippedDate: string;
  status: string;
  description: string;
  shippingAddress: string;
  shippingCity: string;
  paymentType: string;
  voucherId: number;
  customer: getpeople;
  employee: getpeople;
  orderDetails: any[];
}
type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ProductForm = ({
  form,
  products,
  orderDetails,
  setOrderDetails,
}: {
  form: any;
  products: product[] | undefined;
  orderDetails: order[];
  setOrderDetails: (data: any) => void;
}) => {
  const [productForm] = Form.useForm();
  const addProduct = (data: order) => {
    !orderDetails.some((value, index, array) => {
      return value.productId === data.productId;
    })
      ? setOrderDetails([
          ...orderDetails,
          {
            productId: data.productId,
            product: {
              id: data.productId,
              name: products?.find((product) => {
                return product.id === data.productId;
              })?.name,
            },
            quantity: data.quantity,
            price: data.price,
            discount: data.discount,
          },
        ])
      : setOrderDetails(
          orderDetails.map((item) => {
            return item.productId === data.productId
              ? {
                  ...item,
                  quantity: item.quantity + data.quantity,
                  price: data.price,
                  discount: data.discount,
                }
              : item;
          })
        );
  };
  const selectProduct = (productid: number) => {
    let selectedProduct = products?.find((item) => {
      return item.id === productid;
    });
    productForm.setFieldsValue({
      price: selectedProduct?.price,
      discount: selectedProduct?.discount,
    });
  };

  return (
    <Form
      form={productForm}
      onFinish={addProduct}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
    >
      <Form.Item
        name="productId"
        label="Sản phẩm"
        rules={[
          { type: "number" },
          { required: true, message: "Sản phẩm không được bỏ trống" },
        ]}
      >
        <Select
          options={products?.map((item) => {
            return { value: item.id, label: item.name };
          })}
          onSelect={(value) => selectProduct(value)}
        ></Select>
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Số lượng"
        rules={[
          { type: "number", message: "Số lượng không hợp lệ" },
          { type: "integer", message: "Số lượng phải là số nguyên" },
          { required: true, message: "Số lượng không được bỏ trống" },
        ]}
      >
        <InputNumber name="quantity" min={1} step={1}></InputNumber>
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Giá không được bỏ trống" }]}
      >
        <InputNumber name="price" addonBefore="$" min={0.05}></InputNumber>
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm giá"
        rules={[{ required: true, message: "Giảm giá không được bỏ trống" }]}
      >
        <InputNumber
          name="discount"
          addonAfter={"%"}
          min={0}
          max={90}
        ></InputNumber>
      </Form.Item>
      <Form.Item
        wrapperCol={{ sm: { offset: 6 } }}
        style={{ overflow: "hidden" }}
      >
        <Button onClick={() => productForm.submit()}>
          Add Product to Order
        </Button>
      </Form.Item>
    </Form>
  );
};
type EditableCellProps = {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof order;
  record: order;
  handleSave: (record: order) => void;
};
type EditableRowProps = {
  index: number;
};
const EditableContext = React.createContext<FormInstance<any> | null>(null);
const OrderForm = ({
  form,
  onFinish,
  initialValues,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  initialValues?: addschemaInput;
}) => {
  const customers = useGetSubjects("customers");
  const employees = useGetSubjects("employees");
  const products = useGetSubjects("products");
  const [orderDetails, setOrderDetails] = useState<order[]>([]);
  useEffect(() => {
    initialValues
      ? setOrderDetails(initialValues.orderDetails)
      : setOrderDetails([]);
    setOrderDetails((orderDetails) =>
      orderDetails.map((item) => ({ ...item, productId: item.product.id }))
    ); // eslint-disable-next-line
  }, []);
  useEffect(() => {
    form.setFieldValue("orderDetails", orderDetails); // eslint-disable-next-line
  }, [orderDetails]);
  const deleteProduct = (index: number) => {
    let newOrderDetails = orderDetails.slice();
    newOrderDetails.splice(index, 1);
    setOrderDetails(newOrderDetails);
  };

  const EditableRow = ({ index, ...props }: EditableRowProps) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }: EditableCellProps) => {
    const [editing, setEditing] = useState(false);
    const form = React.useContext(EditableContext)!;

    // useEffect(() => {
    //   if (editing) {
    //     inputRef.current!.focus();
    //   }
    // }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();

        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} không được bỏ trống.`,
            },
          ]}
        >
          <InputNumber
            style={{ width: 60 }}
            autoFocus
            // ref={inputRef}
            onPressEnter={save}
            onBlur={save}
          />
        </Form.Item>
      ) : (
        <div className={styles.editableCell} onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const productColumn: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex?: string;
  })[] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product.name",
      key: "product.name",
      render: (_: any, record: any) => {
        return <>{record.product.name}</>;
      },
    },
    {
      title: "Giá cả",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (_: any, record: any) => {
        return <>${record.price}</>;
      },
      responsive: ["lg"],
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "right",
      width: 20,
      editable: true,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      align: "right",
      render: (_: any, record: any) => {
        return <>{record.discount}%</>;
      },
      responsive: ["lg"],
    },
    {
      title: "Thành tiền",
      key: "total",
      align: "right",
      render: (_: any, record: any) => {
        return (
          <>
            $
            {((record.price * (100 - record.discount)) / 100) * record.quantity}
          </>
        );
      },
      responsive: ["md"],
    },
    {
      title: "",
      dataIndex: "actions",
      key: "actions",
      fixed: "right",
      width: 40,
      render: (_: any, record: any, index: number) => {
        return (
          <Popconfirm
            placement="topRight"
            title="Xoá sản phẩm này?"
            description="Bạn có chắc chắn muốn xoá sản phẩm này?"
            onConfirm={() => {
              deleteProduct(index);
            }}
            okText="Đồng ý"
            cancelText="Không"
          >
            <Button icon={<AiOutlineDelete />} danger />
          </Popconfirm>
        );
      },
    },
  ];
  const handleSave = (row: order) => {
    const newData = [...orderDetails];
    const index = newData.findIndex((item) => row.productId === item.productId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setOrderDetails(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = productColumn.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: order) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <Flex vertical gap={10}>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 8 }}
        initialValues={
          initialValues && {
            ...initialValues,
            shippedDate:
              initialValues.shippedDate &&
              dayjs(initialValues.shippedDate).local(),
            createdDate:
              initialValues.createdDate &&
              dayjs(initialValues.createdDate).local(),
          }
        }
      >
        <Form.Item
          name="createdDate"
          label="Ngày tạo"
          rules={[
            { type: "date", message: "Ngày tạo không hợp lệ" },
            // { required: true, message: "Created Date is required" },
          ]}
        >
          <DatePicker
            showTime={{ format: timeFormat }}
            format={dateFormat}
            name="createdDate"
          />
        </Form.Item>
        <Form.Item
          name="shippedDate"
          label="Ngày giao hàng"
          rules={[
            { type: "date", message: "Ngày giao hàng không hợp lệ" },
            // { required: true, message: "Shipped Date is required" },
          ]}
        >
          <DatePicker
            showTime={{ format: timeFormat }}
            format={dateFormat}
            name="shippedDate"
          />
        </Form.Item>
        <Form.Item
          name="shippingAddress"
          label="Địa chỉ giao hàng"
          rules={[
            { type: "string" },
            // { required: true, message: "Shipping Address is required" },
          ]}
        >
          <TextArea name="shippingAddress" autoSize></TextArea>
        </Form.Item>
        <Form.Item
          name="shippingCity"
          label="Thành phố giao hàng"
          rules={[
            { type: "string" },
            // { required: true, message: "Shipping City is required" },
          ]}
        >
          <Input name="shippingCity" type="text"></Input>
        </Form.Item>
        <Form.Item
          name="paymentType"
          label="Phương thức thanh toán"
          rules={[
            {
              type: "enum",
              enum: ["CASH", "CREDIT CARD"],
              message: "Phương thức thanh toán không hợp lệ",
            },
            // { required: true, message: "Payment Type is required" },
          ]}
        >
          <Radio.Group
            optionType="button"
            options={[
              { value: "CASH", label: "Cash" },
              { value: "CREDIT CARD", label: "Credit Card" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[
            {
              type: "enum",
              enum: ["WAITING", "COMPLETED", "CANCELED", "DELIVERING"],
              message: "Status is not valid",
            },

            // { required: true, message: "Status is required" },
          ]}
        >
          <Radio.Group
            optionType="button"
            options={[
              { value: "WAITING", label: "Waiting" },
              { value: "COMPLETED", label: "Completed" },
              { value: "DELIVERING", label: "Delivering" },
              { value: "CANCELED", label: "Canceled", style: { color: "red" } },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="customerId"
          label="Khách hàng"
          rules={[
            { type: "number" },
            { required: true, message: "Customer is required" },
          ]}
        >
          <Select
            options={customers.data?.map((item) => {
              return {
                value: item.id,
                label: item?.firstName + " " + item?.lastName,
              };
            })}
          ></Select>
        </Form.Item>
        <Form.Item
          name="employeeId"
          label="Nhân viên"
          rules={[
            { type: "number" },
            { required: true, message: "Employee is required" },
          ]}
        >
          <Select
            options={employees.data?.map((item) => {
              return {
                value: item.id,
                label: item.firstName + " " + item.lastName,
              };
            })}
          ></Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Ghi chú"
          rules={[
            { type: "string" },
            // { required: true, message: "Description is required" },
            { max: 300, message: "Ghi chú không được quá dài" },
          ]}
        >
          <TextArea name="description" autoSize></TextArea>
        </Form.Item>
        <Form.Item name="orderDetails">
          <Flex justify="center">
            <Title level={4}>Order Detail</Title>
          </Flex>
        </Form.Item>
        {orderDetails.length > 0 && (
          <Table
            components={components}
            rowClassName={styles.editableRow}
            rowKey="productId"
            columns={columns as ColumnTypes}
            dataSource={orderDetails}
            pagination={false}
            style={{ overflow: "hidden" }}
          />
        )}
      </Form>
      <ProductForm
        form={form}
        products={products.data}
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
      />
    </Flex>
  );
};

interface OrderType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Orderant = () => {
  const data = useGetSubjects("orders");
  const custormersFilter =
    data.isSuccess && data.data
      ? uniqBy(
          data.data.map((value: any) => {
            return {
              text: value.customer?.firstName + " " + value.customer?.lastName,
              value: value.customer.id,
            };
          })
        )
      : undefined;
  const employeesFilter =
    data.isSuccess && data.data
      ? uniqBy(
          data.data.map((value: any) => {
            return {
              text: value.employee?.firstName + " " + value.employee?.lastName,
              value: value.employee?.id,
            };
          })
        )
      : undefined;
  const shippingCityFilter =
    data.isSuccess && data.data
      ? uniqBy(
          data.data.map((value: any) => {
            return {
              text: value.shippingCity,
              value: value.shippingCity,
            };
          })
        )
      : undefined;
  const paymentTypeFilter = [
    {
      text: "Cash",
      value: "CASH",
    },
    {
      text: "Credit Card",
      value: "CREDIT CARD",
    },
  ];
  const statusFilter = [
    {
      text: "Waiting",
      value: "WAITING",
    },
    {
      text: "Completed",
      value: "COMPLETED",
    },
    {
      text: "Canceled",
      value: "CANCELED ",
    },
    {
      text: "Delivering",
      value: "DELIVERING",
    },
  ];
  const defaultColumns: ColumnsType<OrderType> = [
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: any, record: OrderType, index: number) => {
        return (
          <>
            {record.createdDate && dayjs(record.createdDate).format(dateFormat)}
          </>
        );
      },
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "shippedDate",
      key: "shippedDate",
      render: (text: any, record: OrderType, index: number) => {
        return (
          <>
            {record.shippedDate && dayjs(record.shippedDate).format(dateFormat)}
          </>
        );
      },
      responsive: ["xxl"],
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      responsive: ["lg"],
      render: (value, record, index) => {
        return record.shippingAddress
          ? `${record.shippingAddress.slice(0, 50)}${
              record.shippingAddress.length > 50 ? "..." : ""
            } `
          : null;
      },
    },
    {
      title: "Thành phố giao hàng",
      dataIndex: "shippingCity",
      key: "shippingCity",
      filterSearch: true,
      filters: shippingCityFilter,
      onFilter: (value, record) => record.shippingCity === value,
      responsive: ["lg"],
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      filters: paymentTypeFilter,
      onFilter: (value, record) => record.paymentType === value,
      responsive: ["xl"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: statusFilter,
      onFilter: (value, record) => record.status === value,
      responsive: ["sm"],
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      filterSearch: true,
      filters: custormersFilter,
      onFilter: (value, record) => record.customer.id === value,
      render: (text: any, record: OrderType, index: number) => {
        return (
          <>
            {record.customer?.firstName +
              " " +
              (record.customer?.lastName || "")}
          </>
        );
      },
      responsive: ["xl"],
    },
    {
      title: "Nhân viên",
      dataIndex: "employee",
      key: "employee",
      filterSearch: true,
      filters: employeesFilter,
      onFilter: (value, record) => record.employee.id === value,
      render: (text: any, record: OrderType, index: number) => {
        return (
          <>
            {record.employee &&
              record.employee?.firstName + " " + record.employee?.lastName}
          </>
        );
      },
      responsive: ["xl"],
    },
    {
      title: "Đơn hàng chi tiết",
      dataIndex: "orderDetails",
      key: "orderDetails",
      render: (text: any, record: OrderType, index: number) => {
        return (
          <ul className={styles.orderDetails}>
            {record.orderDetails.map((item, index) => {
              return (
                <li key={index}>{item.quantity + " x " + item.product.name}</li>
              );
            })}
          </ul>
        );
      },
      responsive: ["md"],
    },
    {
      title: "Mã giảm giá",
      dataIndex: "voucherId",
      key: "voucherId",
      filterSearch: true,
      onFilter: (value, record) => record.voucherId === value,
      responsive: ["lg"],
    },
    {
      title: "Tổng tiền",
      key: "totalOrder",
      align: "right",
      render: (text: any, record: OrderType) => (
        <TotalOrderCell
          orderDetails={record.orderDetails}
          voucherId={record.voucherId}
        />
      ),
      responsive: ["md"],
    },
  ];

  return data.isSuccess ? (
    <SubjectTemplate
      subject="order"
      subjects="orders"
      currentform={<OrderForm />}
      defaultColumns={defaultColumns}
    />
  ) : (
    <Spin />
  );
};
export default Orderant;
