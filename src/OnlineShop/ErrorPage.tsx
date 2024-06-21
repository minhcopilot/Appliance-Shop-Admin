import { Button, Result } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

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
          Quay lại
        </Button>
      }
    />
  );
}
