"use client";
import Image from "next/image";
import userProfile from "@/assets/image/userImage.png";
import { Button, Popconfirm, PopconfirmProps } from "antd";
import { useState } from "react";
import UserModal from "../user-managment/UserModal";
import handleMutation from "@/utils/handleMutation";
import {
  useApproveUserMutation,
  useBlockUserMutation,
} from "@/redux/api/authApi";

type TProps = {
  name: string;
  role: string;
  _id: string;
  user: {
    name: string;
    email: string;
    role: string;
    image: string;
  };
};

const UserCard = ({ data }: { data: TProps }) => {
  const [open, setOpen] = useState(false);
  const [blockUser] = useBlockUserMutation();
  const [approveUser] = useApproveUserMutation();

  // block user
  const confirm: PopconfirmProps["onConfirm"] = () => {
    handleMutation(data?._id, blockUser, `User is being blocked...`);
  };
  // approve user
  const handleApproveUser = () => {
    handleMutation(data?._id, approveUser, `User is being approved...`);
  };

  return (
    <div className="bg-primary-white p-4 flex gap-x-3 rounded">
      <Image
        src={data?.user?.image || userProfile}
        width={50}
        height={50}
        alt="profile_image"
        className="size-20 cursor-pointer"
        onClick={() => setOpen(true)}
      ></Image>
      <div className="space-y-2 ">
        <h3
          className="text-xl font-bold cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {data?.user?.name}
        </h3>
        <p>
          Account Type: <span className="font-medium">{data?.role}</span>
        </p>

        <div className="flex gap-x-5">
          <Button onClick={handleApproveUser} className="bg-primary-orange text-primary-white rounded-none rounded-tl-lg  rounded-br-lg">
            Accept
          </Button>

          <Popconfirm
            title="Block Request"
            description="Are you sure to block this request?"
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button className="border-primary-orange text-primary-orange rounded-none rounded-tl-lg  rounded-br-lg">
              Block
            </Button>
          </Popconfirm>
        </div>
      </div>
      <UserModal id={data?._id} open={open} setOpen={setOpen}></UserModal>
    </div>
  );
};

export default UserCard;
