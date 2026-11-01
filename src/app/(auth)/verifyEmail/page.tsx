import VerifyEmailForm from "@/components/(auth)/verifyEmail/VerifyEmailForm";

const VerifyEmailPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-primary ">
      <div className="flex justify-center items-center md:max-w-[550px] md:h-[350px]  mx-auto border-2 border-[#3A3F3F] md:px-20 px-6 py-5 rounded-[40px] bg-[#154B34] ">
        <div>
          <h2 className="text-2xl font-semibold text-[#F8FAFC] text-center mb-6">
            Verify Email
          </h2>
          <p className=" text-center text-white my-8">
            An OTP was sent to your email. Please enter it below to verify your
            email.
          </p>
          <VerifyEmailForm></VerifyEmailForm>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
