import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root/Root";
import Home from "./routes/home/Home";
import Questions from "./routes/questions/Questions";
import QuestionDetails from "./routes/question-detail/QuestionDetails";
import About from "./routes/about/About";
import AskQuestion from "./routes/ask-question/AskQuestion";
import Profile from "./routes/profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "connect",
        // Component: div>Connect/div>,
      },
      {
        path: "questions",
        Component: Questions,
      },
      {
        path: "questions/:id",
        Component: QuestionDetails,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "ask-question",
        Component: AskQuestion,
      },
      {
        path: "profile",
        Component: Profile,
      },
    ],
  },
]);
