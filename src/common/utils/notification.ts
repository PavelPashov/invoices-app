import { toast } from "react-toastify";

interface INotification {
  type: "success" | "error";
  message: string;
}

export const notify = (options: INotification) => {
  const { type, message } = options;
  return toast[type](message, {
    position: "top-center",
    autoClose: type === "success" ? 3000 : 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
