import Container from "@/components/container"
import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <div className="flex flex-col gap-8">
        <Heading title="Choose your role" description="Select one of the two options below" />
        <div className="flex w-full  justify-center gap-8">
          <Card className="w-80">
            <CardHeader>
              <CardTitle className="font-bold">Employee</CardTitle>
              <CardDescription>Work on your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <img src="employee.png" className="w-full h-64" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full uppercase" onClick={() => navigate('/login/email')}>Login as employee</Button>
            </CardFooter>
          </Card>

          <Card className="w-80">
            <CardHeader>
              <CardTitle className="font-bold">Owner</CardTitle>
              <CardDescription>Manage your employees and tasks</CardDescription>
            </CardHeader>
            <CardContent className="">
              <img src="/owner.png" className="w-full h-64" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full uppercase" onClick={() => navigate('/login/phone')}>Login as owner</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ Container>
  )
}

export default Home