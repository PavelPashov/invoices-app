
import { Dropzone } from "../components/dropzone/Dropzone";

export const InvoicesPage = () => {

  return (
    <div className="flex flex-col w-screen align-middle justify-center items-center">
      <div className="min-h-[50vh] min-w-[70vh] flex flex-col items-center justify-center p-10">
        <Dropzone />
      </div>
    </div >
  )
}