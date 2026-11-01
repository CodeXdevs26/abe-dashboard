"use client";
import { useUpdateProfileMutation } from "@/redux/api/profileApi";
import handleMutation from "@/utils/handleMutation";
import { ConfigProvider } from "antd";
import { Form, Input, Button } from "antd";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";

const EditProfileForm = ({ adminData }: { adminData: {
    name: string;
    email: string;
    phone: string;
    _id?: string;
  } }) => {
  const [phone, setPhone] = useState(adminData.phone || "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const onFinishEditProfile = (values: any) => {
    const formData = new FormData();
    // Phone might come from PhoneInput state
    const submitData = {
      ...values,
      phone: phone || values.phone || "",
    };
    formData.append("data", JSON.stringify(submitData));
    // image is handled separately via the upload component
    handleMutation(
      { formData, id: adminData?._id },
      updateProfile,
      "Updating Profile...",
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
      <Form
        layout="vertical"
        onFinish={onFinishEditProfile}
        initialValues={{
          name: adminData.name || "",
          email: adminData.email || "",
          phone: adminData.phone || "",
        }}
      >
        <Form.Item label="User Name" name="name">
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input disabled size="large" />
        </Form.Item>

        <Form.Item label="Phone no" name="phone">
          <PhoneInput
            country={"us"}
            specialLabel=""
            value={phone || adminData.phone || ""}
            onChange={setPhone}
            inputClass="bg-transparent text-primary-white border border-[#fff] py-1  w-full rounded-md"
            containerClass="w-full"
            dropdownClass="bg-primary-green text-black"
          />
        </Form.Item>

        <Form.Item>
          <Button disabled={isLoading} htmlType="submit" block size="large">
            {isLoading ? "Saving..." : " Save Changes"}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default EditProfileForm;
