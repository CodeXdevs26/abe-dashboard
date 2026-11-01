import { Button, Form, Modal, Upload, message } from "antd";
import { PiUploadLight } from "react-icons/pi";
import { useCreateBannerMutation } from "@/redux/api/bannerApi";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
};

const AddBannerModal = ({ open, setOpen }: TPropsType) => {
  const [createBanner, { isLoading }] = useCreateBannerMutation();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      if (values.image?.fileList?.[0]?.originFileObj) {
        formData.append("image", values.image.fileList[0].originFileObj);
      }
      await createBanner(formData).unwrap();
      message.success("Banner created successfully!");
      form.resetFields();
      setOpen(false);
    } catch (error) {
      message.error("Failed to create banner");
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      style={{
        minWidth: "max-content",
        position: "relative",
      }}
    >
      <div className="pb-2">
        <div className="">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            labelCol={{ style: { color: "#000" } }}
          >
            <Form.Item
              label="Banner Image"
              name="image"
              rules={[{ required: true, message: "Please upload an image!" }]}
              style={{
                textAlign: "center",
                border: "2px dashed #232323",
                minHeight: "150px",
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
              }}
            >
              <Upload
                name="image"
                listType="picture"
                beforeUpload={() => false}
                maxCount={1}
                accept="image/*"
              >
                <div className="flex flex-col justify-center items-center">
                  <PiUploadLight size={40} className="text-primaryBlack" />
                  <p className="text-primaryBlack">
                    Drop your image here, or click to browse <br />
                    Jpeg, png are allowed
                  </p>
                </div>
              </Upload>
            </Form.Item>
            <Button
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
              className="bg-primary-green text-primary-white"
            >
              {isLoading ? "Uploading..." : "Add Banner"}
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddBannerModal;
