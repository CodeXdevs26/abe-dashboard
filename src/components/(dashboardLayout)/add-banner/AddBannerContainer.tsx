"use client";
import { Button, Popconfirm, message } from "antd";
import { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import AddBannerModal from "./AddBannerModal";
import Image from "next/image";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  useGetBannersQuery,
  useDeleteBannerMutation,
} from "@/redux/api/bannerApi";
import Spinner from "@/components/spinner/spinner";

const AddBannerContainer = () => {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useGetBannersQuery({});
  const [deleteBanner] = useDeleteBannerMutation();

  const banners = data?.data || [];

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id).unwrap();
      message.success("Banner deleted successfully!");
      refetch();
    } catch (error) {
      message.error("Failed to delete banner");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Spinner size={120} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-red-500">
        <p>Error loading banners. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Button
          className="w-full bg-primary-orange text-primary-white border-none font-semibold !py-6 uppercase"
          icon={<CiCirclePlus size={20} color="#fff" />}
          onClick={() => setOpen(true)}
        >
          Add New Banner
        </Button>

        {/* Banner List */}
        <div className="mt-6">
          <h1 className="text-2xl text-primary-white font-bold mb-4">
            Banner List ({banners.length})
          </h1>
          {banners.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No banners yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-5">
              {banners.map((banner: { _id: string; image: string }) => (
                <div key={banner._id} className="relative">
                  <Image
                    src={banner.image}
                    alt="banner_image"
                    width={950}
                    height={700}
                    className="w-full max-h-[150px] rounded-md object-cover"
                  />
                  <div className="py-2 px-3 bg-primary-black absolute top-1 right-1 rounded-lg cursor-pointer">
                    <Popconfirm
                      title="Delete this banner"
                      description="Are you sure to delete this banner?"
                      onConfirm={() => handleDelete(banner._id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <FaRegTrashAlt color="#EB2926" size={16} />
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AddBannerModal open={open} setOpen={setOpen} />
    </>
  );
};

export default AddBannerContainer;
