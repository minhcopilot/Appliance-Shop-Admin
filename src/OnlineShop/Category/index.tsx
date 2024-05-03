import React, { useEffect, useState } from "react";
import styles from "./Category.module.css";
import axiosClient from "../config/axiosClient";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../Login";
import { Space } from "antd";

interface addschemaInput {
  name: string;
  description?: string;
}

const addschema = yup
  .object({
    name: yup
      .string()
      .max(100, "Tên của Category không được quá 100 ký tự")
      .required(),
    description: yup.string(),
  })
  .required();

const AddCategory = ({
  refresh,
  setRefresh,
}: {
  refresh: boolean;
  setRefresh: (data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addschema) });
  const submitAddCategory: SubmitHandler<addschemaInput> = async (data) => {
    try {
      const response = await axiosClient.post("/categories/", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      alert(
        "Thêm " + response.data.name + " danh mục với ID: " + response.data.id
      );
      setRefresh(!refresh);
      reset();
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };
  return (
    <Space direction="vertical" size={15}>
      <form onSubmit={handleSubmit(submitAddCategory)}>
        <label htmlFor="addname">Tên Category</label>
        <input type="text" {...register("name")} id="addname" />
        <span>{errors.name?.message}</span>
        <label htmlFor="adddescription">Description</label>
        <input type="text" {...register("description")} id="adddescription" />
        <span>{errors.description?.message}</span>
        <Button type="submit">Thêm mới Category</Button>
      </form>
    </Space>
  );
};

const PatchCategory = ({
  id,
  refresh,
  setRefresh,
  patchPopup,
  setPatchPopup,
}: {
  id: number;
  refresh: boolean;
  setRefresh: (data: any) => void;
  patchPopup: boolean;
  setPatchPopup: (data: any) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addschema) });
  const submitPatchCategory: SubmitHandler<addschemaInput> = async (data) => {
    try {
      const response = await axiosClient.patch("/categories/" + id, data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setError(null);
      reset();
      setRefresh(!refresh);
      setPatchPopup(false);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };
  return (
    <Space
      direction="vertical"
      size={15}
      style={!patchPopup ? { display: "none" } : {}}
      className={styles.popup}
    >
      <form onSubmit={handleSubmit(submitPatchCategory)}>
        <label htmlFor="patchname">Tên Category</label>
        <input type="text" {...register("name")} id="patchname" />
        <span>{errors.name?.message}</span>
        <label htmlFor="patchdescription">Description</label>
        <input type="text" {...register("description")} id="patchdescription" />
        <span>{errors.description?.message}</span>
        <Button type="submit">Thay đổi Category</Button>
        <Button onClick={() => setPatchPopup(false)}>Đóng</Button>
        <span>{error}</span>
      </form>
    </Space>
  );
};

const DeleteCategory = ({
  id,
  refresh,
  setRefresh,
  deletePopup,
  setDeletePopup,
}: {
  id: number;
  refresh: boolean;
  setRefresh: (data: any) => void;
  deletePopup: boolean;
  setDeletePopup: (data: any) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addschema) });
  const ConfirmDeleteCategory = async () => {
    try {
      const response = await axiosClient.delete("/categories/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setError(null);
      reset();
      setRefresh(!refresh);
      setDeletePopup(false);
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };
  return (
    <Space
      direction="vertical"
      size={15}
      style={!deletePopup ? { display: "none" } : {}}
      className={styles.popup}
    >
      <h3>Bạn có chắc muốn xoá category này?</h3>
      <div style={{ display: "flex", gap: 5 }}>
        <Button
          onClick={ConfirmDeleteCategory}
          style={{ backgroundColor: "red" }}
        >
          Đồng ý
        </Button>
        <Button onClick={() => setDeletePopup(false)}>Huỷ bỏ</Button>
      </div>

      <span>{error}</span>
    </Space>
  );
};

const GetAllCategories = ({
  refresh,
  setRefresh,
  isLoggedIn,
}: {
  refresh: boolean;
  setRefresh: (data: any) => void;
  isLoggedIn: boolean;
}) => {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState<number>(-1);
  const [patchPopup, setPatchPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    let getData = async () => {
      try {
        const response = await axiosClient.get("/categories");
        setData(response.data);
        setData((data) => [...data].reverse());
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [refresh]);
  return (
    <div>
      {data.length == 0 ? (
        "Loading"
      ) : (
        <table className={styles.getAllTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Description</th>
              {isLoggedIn && <th></th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index) => {
              return (
                <tr key={index}>
                  <td className={styles.numberData}>{item.id}</td>
                  <td>{item.name?.slice(0, 100)}</td>
                  <td>
                    {item.description?.length > 200
                      ? item.description?.slice(0, 200) + "..."
                      : item.description}
                  </td>
                  {isLoggedIn && (
                    <td style={{ display: "flex", gap: 5 }}>
                      <Button
                        onClick={() => {
                          setCurrentId(item.id);
                          setPatchPopup(true);
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentId(item.id);
                          setDeletePopup(true);
                        }}
                        style={{ backgroundColor: "red" }}
                      >
                        Xoá
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {isLoggedIn && (
        <>
          <PatchCategory
            id={currentId}
            refresh={refresh}
            setRefresh={setRefresh}
            patchPopup={patchPopup}
            setPatchPopup={setPatchPopup}
          />
          <DeleteCategory
            id={currentId}
            refresh={refresh}
            setRefresh={setRefresh}
            deletePopup={deletePopup}
            setDeletePopup={setDeletePopup}
          />
        </>
      )}
    </div>
  );
};

interface getschemaInput {
  categoryid: number;
}

const getschema = yup
  .object({
    categoryid: yup
      .number()
      .typeError("ID là bắt buộc để có được")
      .integer("ID phải là số nguyênr")
      .positive("ID phải lớn hơn 0")
      .required("ID là bắt buộc để có được"),
  })
  .required();
const GetCategory = ({
  refresh,
  setRefresh,
  isLoggedIn,
}: {
  refresh: boolean;
  setRefresh: (data: any) => void;
  isLoggedIn: boolean;
}) => {
  const [data, setData] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>();
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<number>(-1);
  const [patchPopup, setPatchPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(getschema) });
  const submitGetCategory: SubmitHandler<getschemaInput> = async (data) => {
    try {
      setError("Loading");
      const response = await axiosClient.get("/categories/" + data.categoryid);
      setData(response.data);
      setError(null);
    } catch (error: any) {
      setData(null);
      setError(error.response.data.message);
    }
    reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitGetCategory)}>
        <label htmlFor="categoryid">Category ID</label>
        <input type="number" {...register("categoryid")} id="categoryid" />
        <span>{errors.categoryid?.message}</span>
        <Button type="submit">Lấy theo ID của Category</Button>
      </form>
      <span>{error}</span>
      {data && (
        <>
          <table className={styles.getAllTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Description</th>
                {isLoggedIn && <th></th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.numberData}>{data.id}</td>
                <td>{data.name?.slice(0, 100)}</td>
                <td>
                  {data.description?.length > 200
                    ? data.description?.slice(0, 200) + "..."
                    : data.description}
                </td>
                {isLoggedIn && (
                  <td
                    style={{ display: "flex", gap: 5, justifyContent: "end" }}
                  >
                    <Button
                      onClick={() => {
                        setCurrentId(data.id);
                        setPatchPopup(true);
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentId(data.id);
                        setDeletePopup(true);
                      }}
                      style={{ backgroundColor: "red" }}
                    >
                      Xoá
                    </Button>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
          {isLoggedIn && (
            <>
              <PatchCategory
                id={currentId}
                refresh={refresh}
                setRefresh={setRefresh}
                patchPopup={patchPopup}
                setPatchPopup={setPatchPopup}
              />
              <DeleteCategory
                id={currentId}
                refresh={refresh}
                setRefresh={setRefresh}
                deletePopup={deletePopup}
                setDeletePopup={setDeletePopup}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

const Category = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Space direction="vertical" size={15}>
      <GetCategory
        refresh={refresh}
        setRefresh={setRefresh}
        isLoggedIn={isLoggedIn}
      />
      {isLoggedIn && <AddCategory refresh={refresh} setRefresh={setRefresh} />}
      <GetAllCategories
        refresh={refresh}
        setRefresh={setRefresh}
        isLoggedIn={isLoggedIn}
      />
    </Space>
  );
};
export default Category;
