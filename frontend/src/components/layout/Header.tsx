import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { selectUserInfo } from "@/app/slices/auth";
import { useAppSelector } from "@/app/hooks";

const AdminHeader = () => {
  const userInfo = useAppSelector(selectUserInfo)
  return (
    <section className="border-b-2 flex justify-center px-1 sticky top-0 z-10 bg-white">
      <div className="px-5 w-full flex justify-center items-center container">
        <div className="w-full flex py-2 justify-between">
          <div className="flex gap-8">
            <Link to="/" className="flex items-center gap-2">
              {/* <img src="/icon.png" className="w-9 h-9" /> */}
              <div className="text-3xl flex justify-end font-bold font-serif">
                <span className="text-blue-950">Task</span>
                <span className="text-red-900">Man</span>
              </div>
            </Link>
          </div>
          {userInfo && <UserMenu />}
        </div>
      </div>
    </section>
  );
};
export default AdminHeader;