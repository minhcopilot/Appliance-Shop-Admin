import React from "react";
// import styles from "./Product.module.css";
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Statistic,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import TextArea from "antd/es/input/TextArea";
import SubjectTemplate from "../Components/SubjectTemplate";
import useGetSubjects from "../hooks/useGet";
import { uniqBy } from "../hooks/usefulHooks";
import { ArrowRightOutlined, UploadOutlined } from "@ant-design/icons";
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
  imageUrls?: any;
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

  const onRemove = (file: any) => {
    let removeFiles = form.getFieldValue("removeFiles") || [];
    form.setFieldValue("removeFiles", [...removeFiles, file.uid]);
  };

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
        label="Tên sản phẩm"
        rules={[
          { type: "string" },
          { required: true, message: "Tên sản phẩm không được bỏ trống" },
          { max: 100, message: "Tên sản phẩm không được quá dài" },
        ]}
      >
        <Input name="name" type="text"></Input>
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Danh mục"
        rules={[
          { type: "number" },
          { required: true, message: "Danh mục không được bỏ trống" },
        ]}
      >
        <Select
          options={categories.data?.map((item) => {
            return { value: item.id, label: item.name };
          })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        ></Select>
      </Form.Item>
      <Form.Item
        name="supplierId"
        label="Nhà cung cấp"
        rules={[
          { type: "number" },
          { required: true, message: "Nhà cung cấp không được bỏ trống" },
        ]}
      >
        <Select
          options={suppliers.data?.map((item) => {
            return { value: item.id, label: item.name };
          })}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        ></Select>
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Giá không được bỏ trống" }]}
      >
        <InputNumber name="price" addonAfter="đ"></InputNumber>
      </Form.Item>

      <Form.Item
        name="discount"
        label="Giảm giá"
        rules={[{ required: true, message: "Giảm giá không được bỏ trống" }]}
      >
        <InputNumber name="discount" addonAfter="%" min={0} max={90} />
      </Form.Item>
      <Form.Item
        name="stock"
        label="Tồn kho"
        rules={[{ required: true, message: "Tồn kho không được bỏ trống" }]}
      >
        <InputNumber min={0}></InputNumber>
      </Form.Item>
      <Form.Item
        name="description"
        label="Ghi chú"
        rules={[
          { type: "string" },
          { required: true, message: "Ghi chú không được bỏ trống" },
          { max: 300, message: "Ghi chú không được quá dài" },
        ]}
      >
        <TextArea name="description" autoSize></TextArea>
      </Form.Item>
      <Form.Item name="files" label="Hình ảnh">
        <Upload
          name="files"
          // fileList={isEditMode ? fileList1 : fileList}
          listType="picture"
          beforeUpload={() => false}
          // onRemove={onRemove}
          // onChange={handleFileChange}
          defaultFileList={initialValues?.imageUrls || []}
          maxCount={5}
          onRemove={onRemove}
        >
          <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="removeFiles" />
    </Form>
  );
};

const ProductSearchForm = ({
  form,
  onFinish,
  buttons,
}: {
  form?: any;
  onFinish?: (data: any) => void;
  buttons?: React.ReactElement;
}) => {
  const categories = useGetSubjects("categories");
  const suppliers = useGetSubjects("suppliers");

  return (
    <Form form={form} onFinish={onFinish}>
      <Flex wrap="wrap" gap={10}>
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[
            { type: "string" },
            { max: 100, message: "Tên sản phẩm không được quá dài" },
          ]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Input name="name" type="text"></Input>
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Danh mục"
          rules={[{ type: "number" }]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Select
            options={categories.data?.map((item) => {
              return { value: item.id, label: item.name };
            })}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Form.Item>
        <Form.Item
          name="supplierId"
          label="Nhà cung cấp"
          rules={[{ type: "number" }]}
          style={{ flex: 1, minWidth: 220 }}
        >
          <Select
            options={suppliers.data?.map((item) => {
              return { value: item.id, label: item.name };
            })}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Form.Item>
      </Flex>
      <Flex wrap="wrap" gap={10}>
        <Form.Item label="Giá" style={{ flex: 1, minWidth: 220 }}>
          <Flex gap={5}>
            <Form.Item name="priceFrom">
              <InputNumber addonAfter="đ"></InputNumber>
            </Form.Item>
            {" - "}
            <Form.Item name="priceTo">
              <InputNumber addonAfter="đ"></InputNumber>
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item label="Giảm giá" style={{ flex: 1, minWidth: 220 }}>
          <Flex gap={5}>
            <Form.Item name="discountFrom">
              <InputNumber addonAfter="%" min={0} max={90} />
            </Form.Item>
            {" - "}
            <Form.Item name="discountTo">
              <InputNumber addonAfter="%" min={0} max={90} />
            </Form.Item>
          </Flex>
        </Form.Item>
        <Form.Item label="Tồn kho" style={{ flex: 1, minWidth: 300 }}>
          <Flex gap={5} style={{ width: "100%" }} wrap="wrap">
            <Form.Item name="stockFrom" style={{ flex: 1, minWidth: 50 }}>
              <InputNumber min={0} style={{ width: "100%" }}></InputNumber>
            </Form.Item>
            {" - "}
            <Form.Item name="stockTo" style={{ flex: 1, minWidth: 50 }}>
              <InputNumber min={0} style={{ width: "100%" }}></InputNumber>
            </Form.Item>
          </Flex>
        </Form.Item>
        {buttons}
      </Flex>
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (text: any, record: any, index: number) => {
        if (record.imageUrls && record.imageUrls.length > 0) {
          return (
            <div>
              {record.imageUrls.map((image: any, index: number) => (
                <img
                  key={index}
                  src={`${image.url}`}
                  alt={`product-${index}`}
                  width="50px"
                  height={"50px"}
                  style={{ marginRight: "10px", marginBottom: "10px" }}
                />
              ))}
            </div>
          );
        } else {
          return <p>Không có hình ảnh</p>;
        }
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      sorter: (a, b) => a.price - b.price,
      render: (text: any, record: ProductType, index: number) => {
        return (
          <Statistic
            valueStyle={{ fontSize: "1em" }}
            value={`${record.price} đ`}
          />
        );
      },
      responsive: ["lg"],
    },
    {
      title: "Giảm giá",
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
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      align: "right",
      sorter: (a, b) => a.stock - b.stock,
      responsive: ["sm"],
    },
    {
      title: "Danh mục",
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
      title: "Nhà cung cấp",
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
      searchform={<ProductSearchForm />}
    />
  ) : (
    <Spin />
  );
};
export default Productant;
