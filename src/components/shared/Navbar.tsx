import { Button } from "antd";
import React from "react";
import { GoBell } from "react-icons/go";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetProfileQuery } from "@/redux/api/profileApi";
import { useAppSelector } from "@/redux/hooks/hooks";
import { selectUser } from "@/redux/features/authSlice";

type TNavbarType = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ collapsed, setCollapsed }: TNavbarType) => {
  const user = useAppSelector(selectUser);
  const { data } = useGetProfileQuery("", { skip: !user });
  const admin = data?.data;

  const pathname = usePathname();
  const navbarTitle = pathname.split("/")[1];
  return (
    <nav className="flex items-center justify-between py-4 pr-[68px]">
      <div className="flex items-center gap-x-2">
        <Button
          type="text"
          icon={
            collapsed ? (
              <RxCross2 size={32} color="#000" />
            ) : (
              <IoMenu size={32} color="#000" />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 className="capitalize text-2xl font-bold ">
          {navbarTitle.length > 1
            ? navbarTitle.replaceAll("/", " ").replaceAll("-", " ")
            : "dashboard"}
        </h1>
      </div>
      <div className="flex items-center gap-x-6">
        <Link href={"/dashboard/notifications"}>
          <div
            role="button"
            className="relative aspect-square size-12 rounded-full bg-primary-green flex-item-center"
          >
            <GoBell size={20} color="#fff" />
            <span className="absolute top-1.5 right-1.5 size-[18px] bg-warning text-primary-white rounded-full text-sm flex-item-center">
              3
            </span>
          </div>
        </Link>
        <Link href={"/dashboard/profile"}>
          <div className="flex items-center gap-x-3 rounded-full">
            <Image
              src={admin?.image}
              alt="admin profile"
              width={48}
              height={48} 
              className="rounded-full  w-[48px] h-[48px]"
            />
            <h4 className="text-base font-medium">
              {admin?.name.split(" ")[0]}
            </h4>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
