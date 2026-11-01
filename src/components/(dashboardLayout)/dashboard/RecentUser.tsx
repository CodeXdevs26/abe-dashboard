"use client";
import { Table, TableProps } from "antd";
import { format } from "date-fns";
import { ArrowDownWideNarrowIcon } from "lucide-react";

type TDataType = {
  key: number;
  name: string;
  email: string;
  date: string;
  role: string;
};

const users: TDataType[] = [
  {
    key: 1,
    name: "Ava Johnson",
    email: "ava.johnson@example.com",
    date: "2026-04-12T00:00:00.000Z",
    role: "user",
  },
  {
    key: 2,
    name: "Noah Smith",
    email: "noah.smith@example.com",
    date: "2026-04-14T00:00:00.000Z",
    role: "vendor",
  },
  {
    key: 3,
    name: "Emma Brown",
    email: "emma.brown@example.com",
    date: "2026-04-17T00:00:00.000Z",
    role: "rider",
  },
  {
    key: 4,
    name: "Liam Davis",
    email: "liam.davis@example.com",
    date: "2026-04-20T00:00:00.000Z",
    role: "broker",
  },
  {
    key: 5,
    name: "Sophia Wilson",
    email: "sophia.wilson@example.com",
    date: "2026-04-22T00:00:00.000Z",
    role: "user",
  },
];

const RecentUser = () => {
  const columns: TableProps<TDataType>["columns"] = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (value) => `#${value}`,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      render: ({ date }) => <p>{format(date, "dd MMM, yyyy")}</p>,
    },
    {
      title: "Account Type",
      dataIndex: "role",

      filters: [
        {
          text: "User",
          value: "user",
        },
        {
          text: "Vendor",
          value: "vendor",
        },
        {
          text: "Rider",
          value: "rider",
        },
        {
          text: "Broker",
          value: "broker",
        },
      ],
      filterIcon: () => (
        <ArrowDownWideNarrowIcon
          color="#fff"
          className="flex justify-start items-start"
        />
      ),
      onFilter: (value, record) => record.role.indexOf(value as string) === 0,
    },
  ];

  return (
    <>
      <div>
        <Table
          pagination={false}
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={users}
          scroll={{ x: "max-content" }}
        ></Table>
      </div>
    </>
  );
};

export default RecentUser;
