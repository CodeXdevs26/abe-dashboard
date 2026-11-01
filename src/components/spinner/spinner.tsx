import Image from "next/image";
import spinner from "@/assets/Icons/spinner.svg";
import whiteSpinner from "@/assets/Icons/spin-white.svg";

const Spinner = ({
  className,
  size,
  white = false,
}: {
  className?: string;
  size: number;
  white?: boolean;
}) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <Image
        src={white ? whiteSpinner : spinner}
        alt="spinner"
        width={size}
        height={size}
      />
    </div>
  );
};

export default Spinner;
