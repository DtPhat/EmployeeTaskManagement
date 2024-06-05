
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, PanelTop, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateDialog from "./update-dialog";
import ViewDialog from "./view-dialog";
import DeleteDialog from "./delete-dialog";
interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false)
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <ViewDialog
            data={data}
            TriggerButton={
              <Button variant={"ghost"} className='gap-2 w-full h-8 flex justify-start p-1 font-normal'>
                <PanelTop className="size-4" />
                View
              </Button>
            } />
          <UpdateDialog
            data={data}
            open={open}
            handleOpen={() => { setOpen(!open) }}
            TriggerButton={
              <Button variant={"ghost"} className='gap-2 w-full h-8 flex justify-start p-1 font-normal' onClick={() => { setOpen(true) }}>
                <Edit className="size-4" />
                Update
              </Button>
            } />
          <DeleteDialog
            data={data}
            open={alert}
            handleOpen={() => { setAlert(!alert) }}
            TriggerButton={
              <Button variant={"ghost"} className='gap-2 w-full h-8 flex justify-start p-1 font-normal' onClick={() => { setAlert(true) }}>
                <Trash className="size-4" />
                Delete
              </Button>
            } />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};