import { roles } from "@/app/constants";
import { useAppSelector } from "@/app/hooks";
import { selectUserInfo } from "@/app/slices/auth";
import { cn } from "@/lib/utils";
import { CalendarCheck2, MessageSquareMore, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
const DashboardLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const userInfo = useAppSelector(selectUserInfo)
  const userRole = userInfo?.role
  const navigate = useNavigate()
  const sidebarItems = [
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: CalendarCheck2,
      label: "Tasks",
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquareMore,
      label: "Messages",
    },
  ];

  if (userRole == roles.OWNER) {
    sidebarItems.unshift({
      title: "Employees",
      href: "/dashboard/employees",
      icon: Users,
      label: "Admission",
    },)
  }

  return (
    <div>
      <section className="flex justify-center px-2">
        <nav
          className={`relative left-0 hidden min-h-screen border-r-2 lg:block w-72`}
        >
          <div className="space-y-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <nav className="grid items-start gap-4">
                  {sidebarItems.map((item, index) =>
                    <Link
                      key={index}
                      to={item.href}
                    >
                      <span
                        className={cn(
                          "group flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-gray-100 hover:text-gray-700",
                          item.href !== '/admin' && pathname.includes(item.href) ? "bg-gray-100" : "transparent",
                          pathname == '/admin' && item.href == '/admin' ? "bg-gray-100" : "transparent",
                        )}
                      >
                        <item.icon className="mr-2 h-6 w-6" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </div>
        </nav>
        <div className="w-full lg:px-8">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default DashboardLayout