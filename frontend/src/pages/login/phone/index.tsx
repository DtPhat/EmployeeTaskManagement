import { roles } from "@/app/constants";
import { useAppDispatch } from "@/app/hooks";
import { useSendPhoneAccessCodeMutation, useValidatePhoneAccessCodeMutation } from "@/app/services/user";
import { setCredentials } from "@/app/slices/auth";
import Container from "@/components/container";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from 'lucide-react';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  phoneNumber: z.string().length(10, {
    message: "Phone number must be at 10 digits",
  }),
})

const ValidateFormSchema = z.object({
  accessCode: z.string().length(6, {
    message: "Invalid access code format",
  }),
})


export default function PhoneLogin() {
  const [sendPhoneAccessCode, sendPhoneAccessCodeResponse] = useSendPhoneAccessCodeMutation()
  const [validatePhoneAccessCode, validatePhoneAccessCodeResponse] = useValidatePhoneAccessCodeMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [serverError, setServerError] = useState()
  const [serverErrorValidation, setServerErrorValidation] = useState()

  const validationForm = useForm<z.infer<typeof ValidateFormSchema>>({
    resolver: zodResolver(ValidateFormSchema),
    defaultValues: {
      accessCode: ""
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await sendPhoneAccessCode({
        phoneNumber: "+84" + data.phoneNumber
      })
        .unwrap()
        .catch(error => setServerError(error?.data?.message))
      if (sendPhoneAccessCodeResponse.isSuccess) {
        toast({
          title: "An access code has been sent to phone",
          description: "Please check SMS"
        })
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  async function onSubmitValidation(data: z.infer<typeof ValidateFormSchema>) {
    try {
      const responseData = await validatePhoneAccessCode({
        accessCode: data.accessCode,
        phone: "+84" + form.getValues().phoneNumber
      })
        .unwrap()
        .catch((error: any) => setServerErrorValidation(error?.data?.message))
      console.log(responseData)
      dispatch(setCredentials({ ...responseData.userInfo, userToken: responseData.userToken }));
      const userRole = responseData.userInfo?.role
      navigate(userRole == roles.OWNER
        ? "/dashboard/employees"
        : "/dashboard/tasks")
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <Container className="p-8 border rounded-md flex justify-center items-center">
      {
        !sendPhoneAccessCodeResponse.isSuccess ?
          <div className="space-y-8">
            <Button variant="outline" size="icon" onClick={() => navigate('/')}>
              <MoveLeft className="h-4 w-4" />
            </Button>
            <Heading title="Sign in" description="Please enter your phone to sign in" />
            <Form {...form}>
              <form className="w-96 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Please enter 10 digits" {...field} defaultValue={""} />
                      </FormControl>
                      {/* <FormDescription>
                        We will send you access code to this phone.
                      </FormDescription> */}
                      <FormMessage />
                      <p className="text-red-700 text-sm font-semibold">{serverError}</p>
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit" disabled={sendPhoneAccessCodeResponse.isLoading}>Submit</Button>
              </form>
            </Form>
          </div>
          : < div className="space-y-8">
            <Button variant="outline" size="icon" onClick={() => sendPhoneAccessCodeResponse.reset()}>
              <MoveLeft className="h-4 w-4" />
            </Button>
            <Heading title="Phone verification" description="Please check your phone and enter the code we've sent" />
            <Form {...validationForm}>
              <div className="w-96 space-y-6">
                <FormField
                  control={validationForm.control}
                  name="accessCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Please enter access code" {...field} defaultValue={""} />
                      </FormControl>
                      <p className="text-red-700 text-sm font-semibold">{serverErrorValidation}</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" onClick={validationForm.handleSubmit(onSubmitValidation)} disabled={validatePhoneAccessCodeResponse.isLoading}>Submit</Button>
              </div>
            </Form>
          </div>
      }
    </Container >
  )
}