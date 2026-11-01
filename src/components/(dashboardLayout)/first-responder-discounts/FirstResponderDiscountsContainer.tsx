"use client";
import ErrorMessage from "@/components/errorMessage/errorMessage";
import Spinner from "@/components/spinner/spinner";
import {
  FirstResponderDiscounts,
  FirstResponderDiscountsPayload,
  useGetFirstResponderDiscountsQuery,
  useUpdateFirstResponderDiscountsMutation,
} from "@/redux/api/firstResponderDiscountsApi";
import { Button, Form, InputNumber, message } from "antd";
import { useEffect } from "react";

type DiscountField = {
  name: keyof FirstResponderDiscountsPayload;
  label: string;
};

const discountFields: DiscountField[] = [
  { name: "police_officer", label: "Police Officer" },
  { name: "firefighter", label: "Firefighter" },
  { name: "ems_paramedic", label: "EMS / Paramedic" },
  { name: "active_military", label: "Active Military" },
  { name: "veteran", label: "Veteran" },
  { name: "nurse", label: "Nurse" },
  { name: "doctor", label: "Doctor" },
];

const defaultValues = discountFields.reduce(
  (values, field) => ({
    ...values,
    [field.name]: 0,
  }),
  {} as FirstResponderDiscountsPayload,
);

const FirstResponderDiscountsContainer = () => {
  const [form] = Form.useForm<FirstResponderDiscountsPayload>();
  const { data, isLoading, isError } = useGetFirstResponderDiscountsQuery({});
  const [updateDiscounts, { isLoading: isSaving }] =
    useUpdateFirstResponderDiscountsMutation();

  const discounts: FirstResponderDiscounts | undefined = data?.data;

  useEffect(() => {
    if (discounts) {
      form.setFieldsValue({
        ...defaultValues,
        ...discounts,
      });
    }
  }, [discounts, form]);

  const handleSave = async (values: FirstResponderDiscountsPayload) => {
    const payload = discountFields.reduce(
      (result, field) => ({
        ...result,
        [field.name]: Number(values[field.name] || 0),
      }),
      {} as FirstResponderDiscountsPayload,
    );

    try {
      await updateDiscounts(payload).unwrap();
      message.success("First responder discounts saved successfully!");
    } catch (error) {
      message.error("Failed to save first responder discounts");
    }
  };

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
        <ErrorMessage message="Failed to load first responder discounts. Please try again later." />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-white">
          First Responder Discounts
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-300">
          Manage the percentage discount shown for each eligible first responder
          group.
        </p>
      </div>

      <div className="rounded-lg bg-primary-green p-5 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues}
          onFinish={handleSave}
        >
          <div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 xl:grid-cols-3">
            {discountFields.map((field) => (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                rules={[
                  {
                    required: true,
                    message: `${field.label} discount is required`,
                  },
                ]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  max={100}
                  precision={0}
                  addonAfter="%"
                  placeholder="Enter discount"
                />
              </Form.Item>
            ))}
          </div>

          <Button
            htmlType="submit"
            loading={isSaving}
            className="mt-2 w-full border-none bg-primary-orange !py-6 font-semibold uppercase text-primary-white hover:!bg-[#ff8d42] md:w-auto"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FirstResponderDiscountsContainer;
