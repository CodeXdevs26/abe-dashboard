"use client";
import { useSetForgottenPasswordMutation } from "@/redux/api/authApi";
import handleMutation from "@/utils/handleMutation";
import type { FormProps } from "antd";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FieldType = {
  newPass?: string;
  confirmPass?: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const SetNewPassForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [setNewPass, { isLoading }] = useSetForgottenPasswordMutation();

  const onSuccess = (res: any) => {
    if (res.success) router.push("/login");
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (values.newPass !== values.confirmPass)
      return toast.error("Passwords do not match");
    const data = {
      email,
      password: values.confirmPass,
    };
    handleMutation(data, setNewPass, "Updating Password...", onSuccess);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "rgb(248,250,252)",
          },
        },
      }}
    >
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        className="md:w-[481px]"
      >
        <Form.Item<FieldType>
          label="New Password"
          name="newPass"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input.Password size="large" placeholder="*******" />
        </Form.Item>

        <Form.Item<FieldType>
          name="confirmPass"
          label="Confirm Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" placeholder="*******" />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            htmlType="submit"
            size="large"
            className={`${isLoading && "cursor-not-allowed opacity-50"}`}
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default SetNewPassForm;
