"use client";
import { Input, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { IoIosSearch } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { UserX, Gift } from "lucide-react";
import UserModal from "./UserModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowDownWideNarrowIcon,
  BadgeCheck,
  CircleX,
  UserRoundCheck,
} from "lucide-react";
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
  useGiveFreeTrialMutation,
  useUpdateApprovalStatusMutation,
} from "@/redux/api/authApi";
import useDebounced from "@/hooks/useDebounced";
import { format } from "date-fns";
import handleMutation from "@/utils/handleMutation";

type TDataType = {
  key: number;
  id: string;
  authId: string;
  name: string;
  email: string;
  date: string;
  role: string;
  location: string;
  contact: string;
  isCbtHolder: boolean;
  is_blocked: boolean;
  is_approved: boolean;
};

const UserManagementContainer = () => {
  const [open, setOpen] = useState(false);
  const [selectedAuthId, setSelectedAuthId] = useState("");
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounced(searchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [changeUserStatus] = useChangeUserStatusMutation();
  const [giveFreeTrial] = useGiveFreeTrialMutation();
  const [updateApprovalStatus] = useUpdateApprovalStatusMutation();

  const confirm = (id: string, is_blocked: boolean) => {
    handleMutation(
      id,
      changeUserStatus,
      `User is being ${is_blocked ? "unblocked" : "blocked"}...`,
    );
  };

  const handleApprovalAction = (
    authId: string,
    status: "approved" | "rejected",
  ) => {
    handleMutation(
      { authId, status },
      updateApprovalStatus,
      `User is being ${status}...`,
    );
  };

  const limit = 10;
  const {
    data: userData,
    isLoading,
    isError,
  } = useGetAllUsersQuery({
    searchTerm: debouncedSearchText,
    limit,
    page: currentPage,
    fields:
      "name image email location contact isCbtHolder is_blocked is_approved role createdAt auth_id",
    populatedFields: "",
  });
  const total = userData?.data?.meta?.total;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchText]);

  useEffect(() => {
    if (isLoading || typeof total !== "number") {
      return;
    }

    const totalPages = Math.max(1, Math.ceil(total / limit));

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, isLoading, limit, total]);

  const users = (userData?.data?.data || []).map(
    (item: { _id: string; auth_id?: string; name: string; email: string; createdAt: string; role: string; location: string; contact: string; isCbtHolder: boolean; is_blocked: boolean; is_approved: boolean }, index: number) => ({
      key: index,
      id: item._id,
      authId: item.auth_id || item._id,
      name: item.name || "N/A",
      email: item.email || "N/A",
      date: item.createdAt,
      role: item.role || "user",
      location: item.location || "N/A",
      contact: item.contact || "N/A",
      isCbtHolder: item.isCbtHolder || false,
      is_blocked: item.is_blocked || false,
      is_approved: item.is_approved || false,
    }),
  );

  const columns: TableProps<TDataType>["columns"] = [
    {
      title: "#",
      dataIndex: "key",
      render: (value) => `#${(currentPage - 1) * limit + value + 1}`,
      width: 60,
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      ellipsis: true,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      ellipsis: true,
    },
    {
      title: "Date",
      render: ({ date }) => (
        <p>{date ? format(new Date(date), "dd MMM, yyyy") : "N/A"}</p>
      ),
    },
    {
      title: "Account Type",
      dataIndex: "role",
      filters: [
        { text: "User", value: "user" },
        { text: "Vendor", value: "vendor" },
        { text: "Rider", value: "rider" },
        { text: "Broker", value: "broker" },
      ],
      filterIcon: () => (
        <ArrowDownWideNarrowIcon
          color="#fff"
          className="flex justify-start items-start"
        />
      ),
      onFilter: (value, record) => record.role.indexOf(value as string) === 0,
    },
    {
      title: "CBT",
      dataIndex: "isCbtHolder",
      render: (value) => (
        <p className={value ? "text-green-500" : "text-red-500"}>
          {value ? "Yes" : "No"}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_blocked",
      render: (value) => (
        <p className={value ? "text-red-500" : "text-green-500"}>
          {value ? "Blocked" : "Active"}
        </p>
      ),
    },
    {
      title: "Approval",
      dataIndex: "is_approved",
      render: (value) => (
        <p className={value ? "text-green-500" : "text-yellow-500"}>
          {value ? "Approved" : "Not Approved"}
        </p>
      ),
    },
    {
      title: "Action",
      render: (record: {
        id: string;
        authId: string;
        is_blocked: boolean;
        is_approved: boolean;
        role: string;
        email: string;
      }) => {
        const eligibleRoles = ["vendor", "rider", "broker"];
        const showFreeTrial = eligibleRoles.includes(record.role || "");
        const handleGiveFreeTrial = () => {
          handleMutation(
            record.email,
            giveFreeTrial,
            "Giving free trial...",
          );
        };
        return (
          <div className="ml-4 flex gap-x-3">
            <IoEyeOutline
              className="cursor-pointer hover:text-blue-400"
              size={20}
              onClick={() => handleModalOpen(record.authId)}
            />
            <Tooltip title={`${record.is_blocked ? "Unblock" : "Block"} user`}>
              <Popconfirm
                title={`${record.is_blocked ? "Unblock the User" : "Block the User"}`}
                description={`Are you sure to ${
                  record.is_blocked ? "unblock" : "block"
                } this user?`}
                onConfirm={() => confirm(record.id, record.is_blocked)}
                okText="Yes"
                cancelText="No"
              >
                {record.is_blocked ? (
                  <UserRoundCheck
                    className="cursor-pointer hover:text-green-400"
                    size={20}
                    color="green"
                  />
                ) : (
                  <UserX
                    className="cursor-pointer hover:text-red-400"
                    size={20}
                    color="red"
                  />
                )}
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Approve user">
              <Popconfirm
                title="Approve this user"
                description="Are you sure you want to approve this user?"
                onConfirm={() =>
                  handleApprovalAction(record.authId, "approved")
                }
                okText="Yes"
                cancelText="No"
                disabled={record.is_approved}
              >
                <BadgeCheck
                  className={`size-5 ${
                    record.is_approved
                      ? "cursor-not-allowed text-green-300"
                      : "cursor-pointer text-green-600 hover:text-green-400"
                  }`}
                />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Reject user">
              <Popconfirm
                title="Reject this user"
                description="Are you sure you want to reject this user?"
                onConfirm={() =>
                  handleApprovalAction(record.authId, "rejected")
                }
                okText="Yes"
                cancelText="No"
              >
                <CircleX className="size-5 cursor-pointer text-orange-500 hover:text-orange-400" />
              </Popconfirm>
            </Tooltip>
            {showFreeTrial && (
              <Tooltip title="Give free trial">
                <Gift
                  className="cursor-pointer hover:text-purple-400"
                  size={20}
                  color="purple"
                  onClick={handleGiveFreeTrial}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  const onChange: TableProps<TDataType>["onChange"] = (pagination) => {
    setCurrentPage(pagination.current || 1);
  };

  const handleModalOpen = (authId: string) => {
    setOpen(true);
    setSelectedAuthId(authId);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchText(e.target.value);

  if (isError) {
    return (
      <div className="flex flex-col lg:flex-row gap-y-2 items-center justify-between py-4 min-h-[500px] justify-center text-red-500">
        <p>Error loading users. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-y-2 items-center justify-between py-4">
        <h1 className="text-2xl font-bold w-full text-primary-white">
          User Management
        </h1>
        <Input
          onChange={onSearchChange}
          type="search"
          size="large"
          placeholder="Search by name or email..."
          prefix={<IoIosSearch size={20} />}
          className="max-w-md py-2"
          allowClear
        />
      </div>
      <Table
        onChange={onChange}
        loading={isLoading}
        columns={columns}
        dataSource={users}
        style={{ overflowX: "auto" }}
        scroll={{ x: "max-content" }}
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: total || 0,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total) => `Total ${total} users`,
          responsive: true,
        }}
        rowKey="id"
      ></Table>
      <UserModal
        authId={selectedAuthId}
        open={open}
        setOpen={setOpen}
      ></UserModal>
    </div>
  );
};

export default UserManagementContainer;
