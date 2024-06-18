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
import RoleAnt from "./OnlineShop/Role";
import useAuth from "./OnlineShop/hooks/useAuth";
import ForbiddenPage from "./OnlineShop/Role/Forbidden";
import ProtectedRoute from "./OnlineShop/Role/PrivateRoute";

export default function Router() {
  const role: any = useAuth((state) => state.loggedInUser?.roleCode);
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
              element: (
                <ProtectedRoute requiredRole="R1">
                  <Employeeant />
                </ProtectedRoute>
              ),
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

            {
              path: "role",
              element: (
                <ProtectedRoute requiredRole="R1">
                  <RoleAnt />
                </ProtectedRoute>
              ),
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
        {
          path: "forbidden",
          element: <ForbiddenPage />,
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
