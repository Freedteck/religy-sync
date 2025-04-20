import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root/Root";
import Home from "./routes/home/Home";
import Questions from "./routes/questions/Questions";
import QuestionDetails from "./routes/question-detail/QuestionDetails";
import About from "./routes/about/About";
import AskQuestion from "./routes/ask-question/AskQuestion";
import Profile from "./routes/profile/Profile";
import ScholarApplication from "./routes/scholar-application/ScholarApplication";
import Admin from "./routes/admin/Admin";
import Dashboard from "./routes/admin/pages/dashboard/Dashboard";
import AuthGuard from "./auth/AuthGuard";
import Applications from "./routes/admin/pages/applications/Applications";
import Teachings from "./routes/teachings/Teachings";
import TeachingDetails from "./routes/teaching-details/TeachingDetails";
import CreateInsight from "./routes/create-insight/CreateInsight";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <Root />
      </AuthGuard>
    ),
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "connect",
        // Component: <div>Connect</div>,
      },
      {
        path: "teachings",
        Component: Teachings,
      },
      {
        path: "teachings/:id",
        Component: TeachingDetails,
      },
      {
        path: "create-insight",
        Component: CreateInsight,
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
        path: "profile/:id",
        Component: Profile,
      },
      {
        path: "scholar-application",
        Component: ScholarApplication,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthGuard requireAdmin={true}>
        <Admin />
      </AuthGuard>
    ),
    errorElement: <div>Oops! Something went wrong.</div>,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "applications",
        Component: Applications,
      },
    ],
  },
]);
