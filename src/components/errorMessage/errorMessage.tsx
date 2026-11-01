const ErrorMessage = ({
  message,
  className,
}: {
  message: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p className="text-gray-200">{message || "Something went wrong"}</p>
    </div>
  );
};
export default ErrorMessage;
