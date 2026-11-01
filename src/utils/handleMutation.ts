import { toast } from "sonner";

const handleMutation = async (
  data: object | string,
  mutationFunc: any,
  loadingTxt: string,
  onSuccess?: unknown,
  onFailure?: unknown
) => {
  const loadingToast = toast.loading(loadingTxt);
  try {
    const res = await mutationFunc(data).unwrap();
    if (res?.success) {
      toast.success(res?.message || "Success!", { id: loadingToast });
      if (typeof onSuccess === "function") {
        onSuccess(res);
      }
    } else {
      if (typeof onFailure === "function") {
        onFailure(res);
      }
    }
  } catch (error: any) {
    toast.error(error?.data?.message || "Something went wrong!", {
      id: loadingToast,
    });
    console.log("error, ", error);
  }
};

export default handleMutation;
