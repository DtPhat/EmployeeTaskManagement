import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useCreateUsersMutation, useUpdateUserMutation } from "@/app/services/user"
import { roles } from "@/app/constants"
import { UserActionDialog, User } from "@/app/types"
import { DialogClose } from "@radix-ui/react-dialog"

const FormSchema = z.object({
  role: z.enum(["EMPLOYEE", "OWNER"], { message: "Invalid role" }),
})

export default function UpdateDialog({ data: user, TriggerButton, open, handleOpen }: UserActionDialog) {
  const [serverError, setServerError] = useState()
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: user.role,
    },
  })

  useEffect(() => {
    form.reset()
  }, [])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await updateUser({
        id: user.id,
        data: { ...data }
      })
        .unwrap()
        .catch(error => {
          setServerError(error.message)
        })
        .finally(() => handleOpen())
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription>
            Update the details of the employee.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-wrap gap-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className='w-1/2'>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={roles.EMPLOYEE}>{roles.EMPLOYEE}</SelectItem>
                      <SelectItem value={roles.OWNER}>{roles.OWNER}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          {serverError && <p className="text-red-700 text-sm font-semibold">{serverError}</p>}
          <Button onClick={() => { form.reset(), handleOpen() }} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}