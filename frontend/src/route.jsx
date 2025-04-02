import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root/Root";
import Home from "./routes/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
