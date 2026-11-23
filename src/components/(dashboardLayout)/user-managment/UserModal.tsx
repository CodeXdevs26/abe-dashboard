"use client";

import { Modal } from "antd";
import Image from "next/image";
import { format } from "date-fns";
import { useState } from "react";
import { useGetSingleUserByAuthIdQuery } from "@/redux/api/authApi";
import Spinner from "@/components/spinner/spinner";
import pdfICon from "@/assets/image/google-docs.png";
import userImg from "@/assets/image/userImage.png";
import dynamic from "next/dynamic";

// pdf.js needs browser APIs (DOMMatrix, workers) – never render it on the server
const PdfViewer = dynamic(() => import("@/components/pdfViewer/PdfViewer"), {
  ssr: false,
});

type UserRole = "user" | "rider" | "vendor" | "broker" | "admin";

type SingleUserDetailResponse = {
  success: boolean;
  message: string;
  data: {
    auth_id: string;
    profile_id: string | null;
    role: UserRole;
    email: string;
    name: string | null;
    image: string | null;
    contact: string | null;
    location: string | null;
    is_approved: boolean;
    is_email_verified: boolean;
    auth_is_blocked: boolean;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
    role_specific_data:
      | {
          document: string | null;
          isCbtHolder: boolean;
          first_responder_type:
            | "police_officer"
            | "firefighter"
            | "ems_paramedic"
            | "active_military"
            | "veteran"
            | "nurse"
            | "doctor"
            | null;
          first_responder_status:
            | "not_requested"
            | "pending"
            | "approved"
            | "rejected"
            | null;
        }
      | {
          driving_license: string | null;
        }
      | {
          tax_document: string | null;
        }
      | {
          referral_code: string | null;
        }
      | Record<string, never>;
  };
};

type TPropsType = {
  open: boolean;
  setOpen: (collapsed: boolean) => void;
  authId?: string;
};

const isImageFile = (value?: string | null) =>
  Boolean(value && /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(value));

const isPdfFile = (value?: string | null) =>
  Boolean(value && /\.pdf$/i.test(value));

const formatValue = (value: boolean | string | null | undefined) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value || "N/A";
};

const formatDateValue = (value?: string | null) => {
  if (!value) {
    return "N/A";
  }

  return format(new Date(value), "dd MMM, yyyy, hh:mm a");
};

const FilePreview = ({
  label,
  value,
  onPreview,
}: {
  label: string;
  value?: string | null;
  onPreview: (value: string) => void;
}) => (
  <div>
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    {value ? (
      <button
        type="button"
        onClick={() => onPreview(value)}
        className="mt-2 text-left"
      >
        {isImageFile(value) ? (
          <Image
            src={value}
            width={120}
            height={88}
            alt={label}
            className="mt-2 h-[88px] w-[120px] rounded-xl object-cover"
          />
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <Image src={pdfICon} width={40} height={40} alt={label} />
            <span className="text-sm font-medium text-primary-orange">
              View file
            </span>
          </div>
        )}
      </button>
    ) : (
      <p className="mt-1 text-base text-slate-700">N/A</p>
    )}
  </div>
);

const DetailItem = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: boolean | string | null | undefined;
  valueClassName?: string;
}) => (
  <div>
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className={`mt-1 text-base text-slate-800 ${valueClassName || ""}`}>
      {formatValue(value)}
    </p>
  </div>
);

const UserModal = ({ open, setOpen, authId }: TPropsType) => {
  const [viewerFile, setViewerFile] = useState<string | null>(null);
  const { data, isLoading, isError } = useGetSingleUserByAuthIdQuery(authId, {
    skip: !open || !authId,
  }) as {
    data?: SingleUserDetailResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const user = data?.data;
  const roleData = user?.role_specific_data;

  const handleViewerClose = () => setViewerFile(null);

  const renderRoleSpecificSection = () => {
    if (!user || user.role === "admin") {
      return null;
    }

    return (
      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
        <h3 className="text-lg font-semibold text-slate-900">
          Role Specific Data
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          {user.role === "user" && roleData && "document" in roleData && (
            <>
              <FilePreview
                label="Document"
                value={roleData.document}
                onPreview={setViewerFile}
              />
              <DetailItem
                label="First Responder Type"
                value={roleData.first_responder_type}
              />
              <DetailItem
                label="First Responder Status"
                value={roleData.first_responder_status}
              />
            </>
          )}
          {user.role === "rider" && roleData && "driving_license" in roleData && (
            <FilePreview
              label="Driving License"
              value={roleData.driving_license}
              onPreview={setViewerFile}
            />
          )}
          {user.role === "vendor" && roleData && "tax_document" in roleData && (
            <FilePreview
              label="Tax Document"
              value={roleData.tax_document}
              onPreview={setViewerFile}
            />
          )}
          {user.role === "broker" && roleData && "referral_code" in roleData && (
            <DetailItem label="Referral Code" value={roleData.referral_code} />
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      centered
      footer={null}
      open={open}
      onCancel={() => setOpen(false)}
      width={760}
    >
      {isLoading ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Spinner size={120} />
        </div>
      ) : isError || !user ? (
        <div className="flex min-h-[320px] items-center justify-center px-6 text-center">
          <p className="text-lg font-medium text-red-500">
            Failed to load user details. Please try again.
          </p>
        </div>
      ) : (
        <div className="pb-2">
          <div className="mt-4 rounded-3xl bg-primary-green px-6 py-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-[132px] w-[132px] overflow-hidden rounded-full border-4 border-white/90 bg-white">
                <Image
                  className="object-cover"
                  src={user.image || userImg}
                  alt={user.name || "user image"}
                  fill
                />
              </div>
              <h2 className="mt-4 text-center text-3xl font-bold text-white">
                {formatValue(user.name)}
              </h2>
              <p className="mt-1 text-base capitalize text-white/85">
                {formatValue(user.role)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Contact" value={user.contact} />
            <DetailItem label="Location" value={user.location} />
            <DetailItem label="Approved" value={user.is_approved} />
            <DetailItem label="Email Verified" value={user.is_email_verified} />
            <DetailItem
              label="Created At"
              value={formatDateValue(user.createdAt)}
            />
          </div>

          {renderRoleSpecificSection()}
        </div>
      )}

      <Modal
        open={Boolean(viewerFile)}
        footer={null}
        width={860}
        onCancel={handleViewerClose}
        centered
      >
        {viewerFile ? (
          isImageFile(viewerFile) ? (
            <div className="flex justify-center">
              <Image
                src={viewerFile}
                width={760}
                height={560}
                alt="document preview"
                className="h-auto max-h-[75vh] w-auto rounded-2xl object-contain"
              />
            </div>
          ) : isPdfFile(viewerFile) ? (
            <PdfViewer url={viewerFile} />
          ) : (
            <div className="py-10 text-center">
              <a
                href={viewerFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-primary-orange"
              >
                Open this file in a new tab
              </a>
            </div>
          )
        ) : null}
      </Modal>
    </Modal>
  );
};

export default UserModal;
