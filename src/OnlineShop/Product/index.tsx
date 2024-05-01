import React from "react";
// import styles from "./Product.module.css";
import { Form, Input, InputNumber, Select, Spin, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects from "../hooks/useGet";
import { uniqBy } from "../hooks/usefulHooks";
// type Props = {};

interface getoption {
  id: number;
  name: string;
}

interface addschemaInput {
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: getoption;
  supplier: getoption;
}

const ProductForm = ({
  form,
  onFinish,
  initialValues,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  initialValues?: addschemaInput;
}) => {
  const categories = useGetSubjects("categories");
  const suppliers = useGetSubjects("suppliers");

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 8 }}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="Product Name"
        rules={[
          { type: "string" },
          { required: true, message: "Product Name is required" },
          { max: 100, message: "Product Name should not be too long" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[
          { type: "number" },
          { required: true, message: "Category is required" },
        ]}
      >
        <Select
          options={categories.data?.map((item) => {
            return { value: item.id, label: item.name };
          })}
        ></Select>
      </Form.Item>
      <Form.Item
        name="supplierId"
        label="Supplier"
        rules={[
          { type: "number" },
          { required: true, message: "Supplier is required" },
        ]}
      >
        <Select
          options={suppliers.data?.map((item) => {
            return { value: item.id, label: item.name };
          })}
        ></Select>
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[
          { type: "string", message: "Price is not valid" },
          { required: true, message: "Price is required" },
        ]}
      >
        <InputNumber name="price" addonBefore="$"></InputNumber>
      </Form.Item>
      <Form.Item
        name="discount"
        label="Discount"
        rules={[
          { type: "string", message: "Discount is not valid" },
          { required: true, message: "Discount is required" },
        ]}
      >
        <InputNumber
          name="discount"
          addonAfter={"%"}
          min={0}
          max={90}
        ></InputNumber>
      </Form.Item>
      <Form.Item
        name="stock"
        label="Stock Available"
        rules={[
          { type: "string", message: "Stock is not valid" },
          { required: true, message: "Stock is required" },
        ]}
      >
        <InputNumber min={0}></InputNumber>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { type: "string" },
          { required: true, message: "Description is required" },
          { max: 300, message: "Description should not be too long" },
        ]}
      >
        <TextArea name="description" autoSize></TextArea>
      </Form.Item>
    </Form>
  );
};

interface ProductType extends addschemaInput {
  key: React.Key;
  id: number;
}

const Productant = () => {
  const data = useGetSubjects("products");
  const categoriesFilter = data.isSuccess
    ? uniqBy(
        data.data.map((value: any) => {
          return { text: value.category.name, value: value.category.id };
        })
      )
    : undefined;
  const suppliersFilter = data.isSuccess
    ? uniqBy(
        data.data.map((value: any) => {
          return { text: value.supplier.name, value: value.supplier.id };
        })
      )
    : undefined;

  const defaultColumns: ColumnsType<ProductType> = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
      sorter: (a, b) => a.price - b.price,
      render: (text: any, record: ProductType, index: number) => {
        return (
          <Statistic
            valueStyle={{ fontSize: "1em" }}
            value={record.price}
            prefix="$"
          />
        );
      },
      responsive: ["md"],
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      align: "right",
      sorter: (a, b) => a.discount - b.discount,
      render: (text: any, record: ProductType, index: number) => {
        return <>{record.discount}%</>;
      },
      responsive: ["lg"],
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "right",
      sorter: (a, b) => a.stock - b.stock,
      responsive: ["sm"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filterSearch: true,
      filters: categoriesFilter,
      onFilter: (value, record) => record.category.id === value,
      render: (text: any, record: ProductType, index: number) => {
        return <>{record.category.name}</>;
      },
      responsive: ["xl"],
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      filterSearch: true,
      filters: suppliersFilter,
      onFilter: (value, record) => record.supplier.id === value,
      render: (text: any, record: ProductType, index: number) => {
        return <>{record.supplier.name}</>;
      },
      responsive: ["xl"],
    },
  ];

  return data.isSuccess ? (
    <SubjectTemplate
      subject="product"
      subjects="products"
      currentform={<ProductForm />}
      defaultColumns={defaultColumns}
    />
  ) : (
    <Spin />
  );
};
export default Productant;
