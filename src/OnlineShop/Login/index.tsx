import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import styles from "./Login.module.css";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import axiosClient from "../config/axiosClient";

type Props = { setIsLoggedIn: (data: any) => void };

interface loginFormInput {
  username: string;
  password: string;
}

const schema = yup
  .object({
    username: yup.string().email().required(),
    password: yup.string().min(3).max(15).required(),
  })
  .required();

export const Button = ({ ...props }) => {
  return (
    <button className={styles.normalButton + " " + props.className} {...props}>
      {props.children}
    </button>
  );
};

export default function Login({ setIsLoggedIn }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormInput>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<loginFormInput> = async (data) => {
    console.log(data);
    try {
      const response = await axiosClient.post("/admin/auth/login", data);
      if (response.data.loggedInUser) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.loggedInUser.email);
        localStorage.setItem("role", response.data.loggedInUser.roles[0].name);
        setIsLoggedIn(true);
        alert("Logged In");
      } else alert(response.data.message);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <label htmlFor="email">Email</label>
      <input type="email" {...register("username")} id="email" />
      <span>{errors.username?.message}</span>
      <label htmlFor="password">Password</label>
      <input type="password" {...register("password")} id="password" />
      <span>{errors.password?.message}</span>
      <Button type="submit">Login</Button>
    </form>
  );
}
