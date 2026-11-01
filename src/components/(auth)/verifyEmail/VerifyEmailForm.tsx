/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useVerifyOtpMutation } from "@/redux/api/authApi";
import handleMutation from "@/utils/handleMutation";
import type { FormProps } from "antd";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

type FieldType = {
  otp?: string;
  email: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const VerifyEmailForm = () => {
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const onSuccess = (res: any) => {
        console.log('res', res);
    if (res.success) router.push(`/setNewPass?email=${res?.data?.email}`);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    values.email = email as string;
    handleMutation(values, verifyOtp, "Verifying...", onSuccess);
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
          label="OTP"
          name="otp"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          rules={[{ required: true, message: "Please input OPT" }]}
        >
          <Input.OTP size="large" length={6} />
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <Button
            htmlType="submit"
            size="large"
            className={`${isLoading && "cursor-not-allowed opacity-50"}`}
            style={{ backgroundColor: "#232323", color: "#F8FAFC" }}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default VerifyEmailForm;
