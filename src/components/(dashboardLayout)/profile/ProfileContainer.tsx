"use client";
import { Tabs, Upload, message } from "antd";
import Image from "next/image";
import userImg from "@/assets/image/userImage.png";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Camera } from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/profileApi";
import Spinner from "@/components/spinner/spinner";
import { useState } from "react";

const ProfileContainer = () => {
  const { data, isLoading } = useGetProfileQuery("");
  const [updateProfile, { isLoading: isUploading }] =
    useUpdateProfileMutation();
  const [uploading, setUploading] = useState(false);
  const admin = data?.data;

  if (isLoading) {
    return <Spinner size={120} className="h-[65vh]" />;
  }

  const handleImageUpload = (info: any) => {
    const file = info.file;
    if (!file.originFileObj) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file.originFileObj);
      formData.append("data", JSON.stringify({}));

      updateProfile(formData).unwrap().then(() => {
        message.success("Profile image updated successfully!");
      }).catch(() => {
        message.error("Failed to update profile image");
      }).finally(() => {
        setUploading(false);
      });
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <div className="bg-primary-green py-8 rounded font-urbanist">
      <div className="bg-[#1D242D] flex items-center justify-center h-[200px]">
        <div className="flex items-center gap-x-5">
          <div className="max-w-[112px] max-h-[112px]">
            <Image
              src={
                uploading || isUploading
                  ? "/images/spinner.svg"
                  : admin?.image
                    ? admin?.image
                    : userImg
              }
              width={112}
              height={112}
              alt="user image"
              className="size-28 rounded-full "
            />
            <Upload
              onChange={handleImageUpload}
              listType="picture"
              maxCount={1}
              className="!w-[50px] profileUploader"
              style={{ width: "50px", overflow: "hidden" }}
              showUploadList={false}
              accept="image/*"
            >
              <div className="bg-white text-black text-lg p-1 rounded-full flex items-center justify-center -translate-y-8 translate-x-20 cursor-pointer">
                <Camera size={16} />
              </div>
            </Upload>
          </div>

          <div className="text-white">
            <h2 className="font-bold text-2xl">{admin?.name}</h2>
            <p className="text-xl mt-1">Admin</p>
          </div>
        </div>
      </div>

      {/* forms */}
      <div className="w-1/2 mx-auto mt-16 mb-10">
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane
            tab="Edit Profile"
            key="1"
            className="text-primary-white"
          >
            <EditProfileForm adminData={admin} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Change Password"
            key="2"
            className="text-primary-white"
          >
            <ChangePasswordForm />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileContainer;
