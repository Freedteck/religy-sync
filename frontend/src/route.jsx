import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root/Root";
import Home from "./routes/home/Home";
import Questions from "./routes/questions/Questions";
import QuestionDetails from "./routes/question-detail/QuestionDetails";
import About from "./routes/about/About";

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
      {
        path: "questions",
        element: <Questions />,
      },
      {
        path: "questions/:id",
        element: <QuestionDetails />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);
