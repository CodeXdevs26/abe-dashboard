"use client";

import { Button } from "antd";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/redux/api/settingsApi";
import { message } from "antd";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const PrivacyPolicyEditor = () => {
  const { data: settingsData, isLoading } = useGetSettingsQuery({});
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (settingsData?.data?.[0]?.privacy_policy) {
      setValue(settingsData.data[0].privacy_policy);
    } else {
      setValue("");
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      await updateSettings({
        terms_conditions: settingsData?.data?.[0]?.terms_conditions || "",
        privacy_policy: value,
        about_us: settingsData?.data?.[0]?.about_us || "",
        broker_monthly_subscription_fee: settingsData?.data?.[0]?.broker_monthly_subscription_fee || 49,
        rider_monthly_subscription_fee: settingsData?.data?.[0]?.rider_monthly_subscription_fee || 49,
        vendor_monthly_subscription_fee: settingsData?.data?.[0]?.vendor_monthly_subscription_fee || 49,
      }).unwrap();
      message.success("Privacy policy saved successfully!");
    } catch (error) {
      message.error("Failed to save privacy policy");
    }
  };

  const toolbarOptions = [
    ["image"],
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
  ];

  const moduleConest = {
    toolbar: toolbarOptions,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-green"></div>
      </div>
    );
  }

  return (
    <>
      <ReactQuill
        modules={moduleConest}
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Start writing ......"
      />
      <Button
        size="large"
        block
        loading={isSaving}
        style={{
          marginTop: "20px",
          backgroundColor: "transparent",
          color: "#fff",
          border: "1px solid #fff",
          borderRadius: "20px",
        }}
        className="hover:bg-gray-600"
        onClick={handleSave}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </>
  );
};

export default dynamic(() => Promise.resolve(PrivacyPolicyEditor), { ssr: false });