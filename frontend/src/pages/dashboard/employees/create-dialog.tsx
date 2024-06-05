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
import { useState } from "react"
import { useCreateUsersMutation } from "@/app/services/user"
import { roles } from "@/app/constants"
import { toast } from "@/components/ui/use-toast"
import { isError } from "lodash"

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().length(10, { message: "Phone number must be at 10 digits" }),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"], { message: "Invalid role" }),
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
})
export function CreateDialog() {
  const [serverError, setServerError] = useState()
  const [createUser, { isLoading, isSuccess }] = useCreateUsersMutation()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      phone: "",
      role: "EMPLOYEE",
      name: "",
      address: "",
    },
  })

  const handleOpen = () => {
    setOpen(!open)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createUser({ ...data, phone: "+84" + data.phone })
        .unwrap()
        .then(res => {
          toast({
            title: "Employee has been created",
            description: "An email has been sent",
          })
          handleOpen()
        })
        .catch(error => {
          setServerError(error?.data.message)
        })
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create employee</DialogTitle>
          <DialogDescription>
            Add a new employee to your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-wrap gap-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter 10 digits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  {/* <FormDescription>
                    You can manage email addresses in your{" "}
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {serverError && <p className="text-red-700 text-sm font-semibold">{serverError}</p>}
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}