"use client";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineBarChart } from "react-icons/ai";
import { CiBadgeDollar, CiLogout } from "react-icons/ci";
import { PiUsersThreeThin } from "react-icons/pi";
import { TbSettingsCheck } from "react-icons/tb";
import { HiOutlineCircleStack } from "react-icons/hi2";
import { SlBookOpen } from "react-icons/sl";
import logoImage from "@/assets//image/logo.png";
import { useEffect, useState } from "react";
import MenuItem from "antd/es/menu/MenuItem";
import { MdOutlineAddchart } from "react-icons/md";
import { MdOutlinePolicy } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { logOut } from "@/redux/features/authSlice";
import { toast } from "sonner";

type MenuItem = Required<MenuProps>["items"][number];

type TSidebarType = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ collapsed, setCollapsed }: TSidebarType) => {
  const [current, setCurrent] = useState("dashboard");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    localStorage.setItem("activeNav", e.key);
  };

  const dispatch = useAppDispatch();
  useEffect(() => {
    const activeKey = localStorage.getItem("activeNav");
    setCurrent(activeKey as string);
  }, [current, setCurrent]);

  const handleLogout = () => {
    dispatch(logOut());
    toast.success("Successfully Logout");
    window.location.reload();
  };

  const adminNavLink: MenuItem[] = [
    {
      key: "dashboard",
      label: <Link href="/dashboard">Dashboard</Link>,
      icon: <AiOutlineBarChart size={24} />,
    },
    {
      key: "user-management",
      icon: <PiUsersThreeThin strokeWidth={1} size={24} />,
      label: <Link href="/dashboard/user-management">Accounts Details</Link>,
    },
    // {
    //   key: "user-requests",
    //   icon: <NotepadText strokeWidth={1} size={24} />,
    //   label: <Link href="/dashboard/user-requests">User Request</Link>,
    // },
    {
      key: "earnings",
      icon: <CiBadgeDollar strokeWidth={1} size={24} />,
      label: <Link href="/dashboard/earnings">Earnings</Link>,
    },
    // {
    //   key: "coupon-details",
    //   icon: <Component size={24} />,
    //   label: <Link href="/dashboard/coupon">Coupon Details</Link>,
    // },
    {
      key: "add-banner",
      icon: <MdOutlineAddchart size={24} />,
      label: <Link href="/dashboard/add-banner">Add Banner</Link>,
    },
    {
      key: "categories",
      icon: <MdOutlineCategory size={24} />,
      label: <Link href="/dashboard/categories">Categories</Link>,
    },
    {
      key: "first-responder-discounts",
      icon: <MdOutlineLocalOffer size={24} />,
      label: (
        <Link href="/dashboard/first-responder-discounts">
          First Responder Discounts
        </Link>
      ),
    },

    {
      key: "settings",
      icon: <TbSettingsCheck size={24} />,
      label: "Settings",
      children: [
        {
          key: "aboutUs",
          icon: <HiOutlineCircleStack size={24} />,
          label: <Link href="/dashboard/aboutUs">About Us</Link>,
        },
        {
          key: "privacyPolicy",
          icon: <MdOutlinePolicy size={24} />,
          label: <Link href="/dashboard/privacy-policy">Privacy Policy</Link>,
        },
        {
          key: "terms",
          icon: <SlBookOpen size={24} />,
          label: <Link href="/dashboard/terms">Terms of use</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <CiLogout strokeWidth={0.8} size={24} />,
      label: <button onClick={handleLogout}>Logout</button>,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(!value)}
      className={`px-4 overflow-hidden ${!collapsed ? "min-w-[250px]" : ""}`}
    >
      <div>
        <div className=" flex justify-center pb-8 pt-6">
          <Image src={logoImage} alt="logoImage"></Image>
        </div>
        <Menu
          onClick={onClick}
          defaultOpenKeys={["dashboard"]}
          selectedKeys={[current]}
          mode="inline"
          items={adminNavLink}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
