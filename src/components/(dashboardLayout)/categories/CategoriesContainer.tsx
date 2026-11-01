"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Popconfirm, Table, TableProps, Tooltip } from "antd";
import { format } from "date-fns";
import { CiCirclePlus } from "react-icons/ci";
import { Edit, Trash2 } from "lucide-react";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoryApi";
import Spinner from "@/components/spinner/spinner";
import ErrorMessage from "@/components/errorMessage/errorMessage";
import CategoryModal from "./CategoryModal";
import handleMutation from "@/utils/handleMutation";

type CategoryItem = {
  _id: string;
  name?: string;
  image?: string;
  icon?: string;
  createdAt?: string;
};

type CategoryRow = {
  key: string;
  id: string;
  name: string;
  image?: string;
  createdAt?: string;
  original: CategoryItem;
};

const CategoriesContainer = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null,
  );
  const { data, isLoading, isError } = useGetCategoriesQuery({});
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categoryList: CategoryItem[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const categories: CategoryRow[] = categoryList.map((item) => ({
    key: item._id,
    id: item._id,
    name: item.name || "Untitled Category",
    image: item.image || item.icon,
    createdAt: item.createdAt,
    original: item,
  }));

  const handleCreateClick = () => {
    setSelectedCategory(null);
    setOpen(true);
  };

  const handleEditClick = (category: CategoryItem) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    handleMutation(id, deleteCategory, "Category is being deleted...");
  };

  const columns: TableProps<CategoryRow>["columns"] = [
    {
      title: "#",
      dataIndex: "key",
      width: 70,
      render: (_value, _record, index) => `#${index + 1}`,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "Image/Icon",
      dataIndex: "image",
      render: (value: string | undefined, record) =>
        value ? (
          <div className="flex items-center gap-3">
            <Image
              src={value}
              alt={record.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          </div>
        ) : (
          <span className="text-gray-300">No image</span>
        ),
      width: 140,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      render: (value?: string) =>
        value ? format(new Date(value), "dd MMM, yyyy") : "N/A",
      width: 160,
    },
    {
      title: "Action",
      width: 140,
      render: (_value, record) => (
        <div className="ml-2 flex items-center gap-3">
          <Tooltip title="Edit category">
            <button
              type="button"
              onClick={() => handleEditClick(record.original)}
              className="cursor-pointer text-primary-orange hover:text-[#ff9c5c]"
            >
              <Edit size={18} />
            </button>
          </Tooltip>
          <Tooltip title="Delete category">
            <Popconfirm
              title="Delete this category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <button
                type="button"
                className="cursor-pointer text-red-500 hover:text-red-400"
                disabled={isDeleting}
              >
                <Trash2 size={18} />
              </button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size={120} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <ErrorMessage message="Failed to load categories. Please try again later." />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-primary-white">Categories</h1>
          <Button
            className="w-full border-none bg-primary-orange !py-6 font-semibold uppercase text-primary-white lg:w-auto"
            icon={<CiCirclePlus size={20} color="#fff" />}
            onClick={handleCreateClick}
          >
            Create Category
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} categories`,
            responsive: true,
          }}
        />
      </div>

      <CategoryModal
        open={open}
        setOpen={setOpen}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoriesContainer;
