// "use client";
// import { Button, Dropdown, Input, MenuProps } from "antd";
// import { ArrowDownWideNarrowIcon } from "lucide-react";
// import { IoIosSearch } from "react-icons/io";
// import UserCard from "./UserCard";
// import Spinner from "@/components/spinner/spinner";
// import ErrorMessage from "@/components/errorMessage/errorMessage";

// const UserRequestContainer = () => {
//   const params = {
//     fields: "user userType email createdAt role is_blocked is_deleted",
//     is_blocked: false,
//     is_deleted: false,
//     is_approved: false,
//     limit: 100000,
//   };

//   const items: MenuProps["items"] = [
//     {
//       key: "vendor",
//       label: "Vendor",
//     },
//     {
//       key: "rider",
//       label: "Rider",
//     },
//     {
//       key: "broker",
//       label: "Broker",
//     },
//   ];

//   const onFilter = ({ key }: { key: string }) => {
//     console.log(`selected, `, key);
//   };

//   return (
//     <div className="min-h-[80vh] bg-primary-green px-4 py-2 rounded-md">
//       <div className="flex items-center justify-between py-4">
//         <h1 className="text-2xl font-bold w-full text-primary-white">
//           User Requests
//         </h1>
//         <div className="flex gap-x-2 justify-center items-center">
//           <Input
//             type="search"
//             size="large"
//             placeholder="Search..."
//             prefix={<IoIosSearch size={20} />}
//             className="max-w-md xl:min-w-[300px] w-full"
//           />
//           <Dropdown
//             menu={{ items, onClick: onFilter }}
//             placement="bottomLeft"
//             arrow
//           >
//             <Button className="text-primary-white bg-primary-orange py-4">
//               <ArrowDownWideNarrowIcon size={16} /> Filter
//             </Button>
//           </Dropdown>
//         </div>
//       </div>
//       {/* show request users data */}
//       {isLoading ? (
//         <Spinner size={120} className="mt-44" white />
//       ) : error ? (
//         <ErrorMessage
//           className="text-center py-20"
//           message={(error as any)?.error}
//         />
//       ) : filteredUsers?.length === 0 ? (
//         <p className="text-center py-20 text-primary-white">
//           No User Requests Found
//         </p>
//       ) : (
//         <div className="mt-10 grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-4">
//           {filteredUsers?.map((data: { _id: string; name?: string; role?: string; user?: any }, inx: number) => (
//             <UserCard key={inx} data={data as any} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserRequestContainer;
