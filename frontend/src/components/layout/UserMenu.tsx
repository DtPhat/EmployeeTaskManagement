import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { api } from "@/app/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logout, selectUserInfo } from "@/app/slices/auth";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  LogOut,
  Settings,
  UserRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "../ui/use-toast";
import { anonymousAvatar } from "@/app/constants";

const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfo = useAppSelector(selectUserInfo);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center rounded bg-transparent hover:bg-gray-50 border p-1 gap-2 justify-between cursor-pointer">
          <img
            src={anonymousAvatar}
            alt="avatar"
            className="rounded-full w-8 h-8"
          />
          <span className="w-32 text-base truncate font-medium hidden md:block">
            {userInfo?.name}
          </span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2">
            <UserRound className="w-4 h-4 text-black/70" />
            <div>Profile</div>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2">
            <Settings className="w-4 h-4 text-black/70" />
            <div onClick={() => toast({
              variant: "destructive",
              title: "Feature is under development.",
              description: "Please try later!",
            })} >Settings</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            dispatch(api.util.resetApiState());
            navigate("/");
          }}
          className="gap-2"
        >
          <LogOut className="w-4 h-4 text-black/70" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;