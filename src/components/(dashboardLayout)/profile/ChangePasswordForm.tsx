"use client";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { TJwtPayload, TResponse } from "@/types/type";
import getUserByToken from "@/utils/getUserByToken";
import handleMutation from "@/utils/handleMutation";
import { ConfigProvider } from "antd";
import { Form, Input, Button } from "antd";

const ChangePasswordForm = () => {
  const [updatePassword, { isLoading }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();

  // on login success
  const onLoginSuccess = (
    res: TResponse<{ accessToken: string; refreshToken: string }>
  ) => {
    const accessToken = res.data?.accessToken;
    const user = getUserByToken(accessToken!) as TJwtPayload;

    if (res.success) dispatch(setUser({ token: accessToken, user }));
  };

  // @ts-expect-error: Ignoring TypeScript error due to inferred 'any' type for 'values' which is handled in the form submit logic
  const onFinishChangePassword = (values) => {
    const data = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    handleMutation(
      data,
      updatePassword,
      "Updating Password...",
      onLoginSuccess
    );
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBgContainer: "transparent",
            activeBorderColor: "#243A40",
            colorTextPlaceholder: "rgb(192, 199, 202)",
            colorIcon: "rgba(255,255,255,0.45)",
            colorBorder: "#D9D9D9",
            colorText: "white",
          },
          Form: {
            labelColor: "white",
          },
          Button: {
            colorBgContainer: "rgb(248,250,252)",
            colorText: "rgb(35,35,35)",
          },
        },
      }}
    >
      <Form layout="vertical" onFinish={onFinishChangePassword}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            {
              required: true,
              message: "Please enter your current password!",
            },
          ]}
        >
          <Input.Password size="large" placeholder="Current Password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter a new password!" }]}
        >
          <Input.Password size="large" placeholder="New Password" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmNewPassword"
          rules={[
            {
              required: true,
              message: "Please confirm your new password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Confirm New Password" />
        </Form.Item>

        <Form.Item>
          <Button disabled={isLoading} htmlType="submit" block size="large">
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default ChangePasswordForm;
