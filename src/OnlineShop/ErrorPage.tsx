import { Button, Result } from "antd";
// import { relative } from "path";
// import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";

// type Props = {};

export default function ErrorPage() {
  const error: any = useRouteError();
  const navigate = useNavigate();
  return (
    <Result
      status={error.status}
      title={error.status}
      subTitle={error.statusText || error.message}
      extra={
        <Button
          onClick={() => navigate("..", { relative: "path" })}
          type="primary"
        >
          Go Back
        </Button>
      }
    />
  );
}
