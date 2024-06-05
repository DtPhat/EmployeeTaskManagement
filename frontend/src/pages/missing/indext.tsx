
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Missing = () => {
  return (
    <article className="p-36">
      <h1>Oh!</h1>
      <p>Page not found</p>
      <div className="">
        <Button variant={"link"}>
          <Link to="/" className="font-bold text-black/80">Return to home</Link>
        </Button>
      </div>
    </article>
  )
}

export default Missing
