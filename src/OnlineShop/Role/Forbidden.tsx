import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        backgroundColor: "white",
      }}
    >
      <div>
        <p style={{ fontSize: "26px", paddingTop: "32px", fontWeight: "bold" }}>
          Bạn không có quyền truy cập trang này. Liên hệ admin để được cấp quyền
        </p>
      </div>
      <Button
        style={{ marginTop: "50px" }}
        onClick={() => navigate("..", { relative: "path" })}
        type="primary"
      >
        Trở về trang chủ
      </Button>
    </div>
  );
}
