"use client";
import type { FormProps } from "antd";
import { Checkbox, Form, Input, Flex, ConfigProvider } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import { useSignInMutation } from "@/redux/api/authApi";
import getUserByToken from "@/utils/getUserByToken";
import { TJwtPayload, TResponse } from "@/types/type";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { setUser } from "@/redux/features/authSlice";
import handleMutation from "@/utils/handleMutation";
import { toast } from "sonner";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginForm = () => {
  const params = useSearchParams();
  const redirectUrl = params.get("redirect");

  const router = useRouter();
  const [login, { isLoading }] = useSignInMutation();
  const dispatch = useAppDispatch();
  // on login success
  const onLoginSuccess = (
    res: TResponse<{ accessToken: string; refreshToken: string }>,
  ) => {
    const accessToken = res.data?.accessToken;
    const user = getUserByToken(accessToken!) as TJwtPayload;

    if (user.role !== "admin") {
      return toast.warning("Only admin can login to the dashboard!");
    }
    dispatch(setUser({ token: accessToken, user }));
    // Only allow same-origin relative paths to prevent open redirects
    // (e.g. ?redirect=https://evil.com, //evil.com, /\evil.com, javascript:...)
    const isSafeRedirect =
      !!redirectUrl &&
      redirectUrl.startsWith("/") &&
      !redirectUrl.startsWith("//") &&
      !redirectUrl.startsWith("/\\");
    router.push(isSafeRedirect ? redirectUrl! : "/dashboard");
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    handleMutation(values, login, "Logging in...", onLoginSuccess);
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
        initialValues={
          // Never ship default credentials in production bundles
          process.env.NODE_ENV === "development"
            ? { remember: false, email: "admin@gmail.com", password: "admin" }
            : { remember: false }
        }
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="md:w-[481px]"
      >
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please enter a valid email address!",
            },
          ]}
        >
          <Input size="large" type="email" placeholder="Example@gmail.com" />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password size="large" placeholder="*******" />
        </Form.Item>

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          style={{ color: "#F8FAFC" }}
        >
          <Flex justify="space-between" align="center">
            <Checkbox style={{ color: "#F8FAFC" }}>Remember me</Checkbox>
            <Link href={"/forgetPassword"} style={{ textDecoration: "" }}>
              <p className="text-[#8ABA51]">Forgot Password?</p>
            </Link>
          </Flex>
        </Form.Item>

        <Form.Item style={{ display: "flex", justifyContent: "center" }}>
          <button
            disabled={isLoading}
            type="submit"
            className={`${styles.btn} pl-8 rounded-md ${
              isLoading && "cursor-not-allowed opacity-50"
            }`}
          >
            {isLoading ? "Logging..." : "Login"}
          </button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default LoginForm;
