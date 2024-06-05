import { useCreateUsersMutation, useUpdateProfileMutation } from "@/app/services/user"
import { User } from "@/app/types"
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  // email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().length(10, { message: "Phone number must be at 10 digits" }),
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
})
export default function UpdateProfileDialog({ data }: { data: User | undefined }) {
  const [serverError, setServerError] = useState()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name,
      // email: data?.email.emailAddress,
      phone: data?.phone.phoneNumber.substring(3, 13),
      address: data?.address,
    },
  })


  const handleOpen = () => {
    setOpen(!open)
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await updateProfile({ ...data, phone: "+84" + data.phone })
        .unwrap()
        .then(res => {
          toast({
            title: "Updated successfully",
            description: "Your information has been changed",
          })
        })
        .catch(error => {
          setServerError(error.message)
        })
        .finally(() => {
          // handleChange()
          handleOpen()
        })
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="text-xs md:text-sm w-full" variant='secondary' onClick={() => setOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Update Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Make changes to your information
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-wrap gap-8" onSubmit={form.handleSubmit(onSubmit)}>
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
            {/* <FormField
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
            /> */}
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
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
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
        <DialogFooter>
          {serverError && <p className="text-red-700 text-sm font-semibold">{serverError}</p>}
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}