"use client";

import { useEffect } from "react";
import { Button, Form, Input, Modal, Upload } from "antd";
import { PiUploadLight } from "react-icons/pi";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApi";
import handleMutation from "@/utils/handleMutation";

type CategoryItem = {
  _id: string;
  name?: string;
  image?: string;
  icon?: string;
};

type CategoryModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: CategoryItem | null;
};

type CategoryFormValues = {
  name: string;
  image?: {
    fileList?: Array<{
      originFileObj?: File;
    }>;
  };
};

const CategoryModal = ({
  open,
  setOpen,
  category,
}: CategoryModalProps) => {
  const [form] = Form.useForm<CategoryFormValues>();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const isEditing = Boolean(category?._id);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: category?.name || "",
        image: undefined,
      });
    } else {
      form.resetFields();
    }
  }, [category, form, open]);

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = (values: CategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);

    const selectedFile = values.image?.fileList?.[0]?.originFileObj;
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (isEditing && category?._id) {
      handleMutation(
        { id: category._id, formData },
        updateCategory,
        "Category is being updated...",
        handleClose,
      );
      return;
    }

    handleMutation(
      formData,
      createCategory,
      "Category is being created...",
      handleClose,
    );
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={handleClose}
      className="category-modal"
      title={
        <div className="border-b border-slate-200 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-orange">
            Catalog
          </p>
          <h2 className="mt-2 text-[24px] font-medium leading-tight text-slate-700">
            {isEditing ? "Edit Category" : "Add Category"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Keep category details clean and easy to scan in the app.
          </p>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: category?.name || "" }}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please enter a category name" }]}
        >
          <Input
            placeholder="Enter category name"
            size="large"
            className="rounded-2xl border-0 bg-[#f4f7f3] px-4 py-3 text-base font-medium text-slate-800 shadow-none"
          />
        </Form.Item>

        <Form.Item
          label={isEditing ? "Replace Image/Icon" : "Category Image/Icon"}
          name="image"
          extra={
            category?.image || category?.icon
              ? "Leave empty to keep the current image."
              : "Optional"
          }
        >
          <Upload
            name="image"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            <div className="flex min-h-[170px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary-orange/70 bg-gradient-to-br from-[#fff8f2] to-[#f7fbf7] px-6 py-8 text-center transition-colors hover:border-primary-orange">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-orange/10 text-primary-orange">
                <PiUploadLight size={28} />
              </div>
              <p className="text-base font-semibold text-slate-800">
                Click to upload an image or icon
              </p>
              <p className="mt-1 text-sm text-slate-500">
                JPG, PNG, WEBP supported
              </p>
            </div>
          </Upload>
        </Form.Item>

        <Button
          htmlType="submit"
          loading={isCreating || isUpdating}
          block
          size="large"
          className="mt-2 h-12 rounded-2xl border-none bg-primary-green text-base font-semibold text-primary-white shadow-none"
        >
          {isCreating || isUpdating
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Category"
              : "Create Category"}
        </Button>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
