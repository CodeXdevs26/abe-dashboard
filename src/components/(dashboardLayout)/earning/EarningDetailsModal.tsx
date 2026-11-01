import { Modal } from "antd";

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  data: {
    payerName: string;
    payerEmail: string;
    amount: number;
    date: string;
    vendorName: string;
    vendorEmail: string;
  } | null;
};

const EaringDetaisModal = ({ open, setOpen, data }: TPropsType) => {
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
      <div className="pb-4">
        <h4 className="text-center text-2xl font-medium mb-6">
          Transaction Details
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Payer Name</h4>
            <p className="font-medium text-black">{data?.payerName || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Payer Email</h4>
            <p className="font-medium text-black">{data?.payerEmail || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Vendor</h4>
            <p className="font-medium text-black">{data?.vendorName || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Vendor Email</h4>
            <p className="font-medium text-black">{data?.vendorEmail || "N/A"}</p>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Amount</h4>
            <p className="font-medium text-green-600">
              ${data?.amount?.toLocaleString() || 0}
            </p>
          </div>
          <div className="flex justify-between border-b border-gray-600 pb-2">
            <h4 className="text-gray-400">Date</h4>
            <p className="font-medium text-black">
              {data?.date ? new Date(data.date).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EaringDetaisModal;
