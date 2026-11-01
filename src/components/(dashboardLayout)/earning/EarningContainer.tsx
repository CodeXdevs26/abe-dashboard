"use client";
import { Table, TableProps } from "antd";
import { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import EaringDetaisModal from "./EarningDetailsModal";
import { useGetEarningsStatsQuery } from "@/redux/api/paymentApi";
import Spinner from "@/components/spinner/spinner";

const EarningContainer = () => {
  const [open, setOpen] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState<{
    payerName: string;
    payerEmail: string;
    amount: number;
    date: string;
    vendorName: string;
    vendorEmail: string;
    _id: string;
  } | null>(null);
  const { data, isLoading, isError } = useGetEarningsStatsQuery({});
  const stats = data?.data;

  const earnings = stats?.tableData || [];

  const columns: TableProps["columns"] = [
    {
      title: "Serial",
      dataIndex: "key",
      render: (_: number, __: any, index: number) => `#${index + 1}`,
      width: 80,
    },
    {
      title: "Payer Name",
      dataIndex: "payerName",
      ellipsis: true,
    },
    {
      title: "Payer Email",
      dataIndex: "payerEmail",
      ellipsis: true,
    },
    {
      title: "Vendor",
      dataIndex: "vendorName",
      ellipsis: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value: number) => <p>${value}</p>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (value: string) => <p>{new Date(value).toLocaleDateString()}</p>,
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <div className="ml-4">
          <IoEyeOutline
            className="cursor-pointer hover:text-blue-400"
            size={20}
            onClick={() => {
              setSelectedEarning(record);
              setOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size={120} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>Error loading earnings data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-y-3 items-center py-4 gap-x-10">
        <h1 className="text-2xl font-bold text-primary-white">Earnings</h1>
        <>
          <div className="flex items-center gap-x-6 p-3 bg-primary-orange rounded-lg text-white">
            <div className="flex items-center gap-x-3">
              <FaArrowRightArrowLeft size={20} color="white" />
              <p className="text-white">Today&apos;s Earning</p>
            </div>
            <p className="font-semibold text-base">
              ${stats?.todayEarning || 0}
            </p>
          </div>
        </>
        <>
          <div className="flex items-center gap-x-3 p-3 bg-primary-orange rounded-lg text-white">
            <FaArrowRightArrowLeft size={20} color="white" />
            <p className="text-white">Total Earning</p>
            <p className="font-semibold text-base">
              ${stats?.totalEarning || 0}
            </p>
          </div>
        </>
      </div>
      <Table
        columns={columns}
        dataSource={earnings}
        rowKey="_id"
        scroll={{ x: "max-content" }}
        pagination={{
          pageSize: 10,
          total: stats?.meta?.total || 0,
          showTotal: (total) => `Total ${total} records`,
          responsive: true,
        }}
      ></Table>
      <EaringDetaisModal
        open={open}
        setOpen={setOpen}
        data={selectedEarning}
      ></EaringDetaisModal>
    </div>
  );
};

export default EarningContainer;
