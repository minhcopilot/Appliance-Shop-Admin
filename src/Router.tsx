import { Spin } from "antd";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import OnlineShop, { Notice } from "./OnlineShop";
import ErrorPage from "./OnlineShop/ErrorPage";
import Categoryant from "./OnlineShop/Category/Categoryant";
import Supplierant from "./OnlineShop/Supplier";
import Employeeant from "./OnlineShop/Employee";
import Customerant from "./OnlineShop/Customer";
import Productant from "./OnlineShop/Product";
import Orderant from "./OnlineShop/Order";
import App, { Welcome } from "./App";
// import useAuth from "./OnlineShop/hooks/useAuth";
import ArticleCategory from "./Post/Category";
import Article from "./Post";
import Post from "./Post/Post";
import Comment from "./Post/Comment";
import Chat from "./Chat";
import ChatOutlet from "./Chat/components/ChatOutlet";
import Voucherant from "./OnlineShop/Voucher";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "management",
          element: <OnlineShop />,
          children: [
            {
              path: "/management",
              element: <Notice />,
            },
            {
              path: "category",
              element: <Categoryant />,
            },
            {
              path: "supplier",
              element: <Supplierant />,
            },
            {
              path: "employee",
              element: <Employeeant />,
            },
            {
              path: "customer",
              element: <Customerant />,
            },
            {
              path: "product",
              element: <Productant />,
            },
            {
              path: "order",
              element: <Orderant />,
            },
            {
              path: "voucher",
              element: <Voucherant />,
            },
          ],
        },
        {
          path: "article",
          element: <Article />,
          children: [
            {
              path: "category",
              element: <ArticleCategory />,
            },
            {
              path: "category/:postCategoryId",
              element: <Post />,
            },
            {
              path: "post",
              element: <Post />,
            },
            {
              path: "post/:postId",
              element: <Comment />,
            },
            {
              path: "comment",
              element: <Comment />,
            },
          ],
        },
        {
          path: "chat",
          element: <Chat />,
          children: [
            {
              path: ":chatId",
              element: <ChatOutlet />,
            },
          ],
        },
      ],
    },
  ]);
  const queryClient = new QueryClient();
  // const auth = useAuth();

  // React.useEffect(() => {
  //   auth.loggedInUser && auth.refresh();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <React.Suspense fallback={<Spin />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.Suspense>
  );
}
