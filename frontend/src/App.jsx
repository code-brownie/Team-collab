import { Routes, Route } from "react-router";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Task from "./Pages/Task";
import Project from "./Pages/Project";
import MultiStepForm from "./forms/Multistepform";
import ProjectLayout from "./Layout/ProjectLayout";
import DashboardLayout from "./Layout/DashboardLayout";
import ProjectOverview from "./Pages/ProjectOverview";
import KanbanBoard from "./Pages/KanbanBoard";
import TeamsPage from "./Pages/Team";
import FileSharing from "./Pages/File";
import RegisterUser from "./components/RegisterToSocket";
import NotificationList from "./components/NotificationList";

function App() {

  return (
    <>
      <RegisterUser />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/project" element={<Project />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/create-project" element={<MultiStepForm />} />
        </Route>
        <Route element={<ProjectLayout />}>
          {/* <Route path="/project/overview" element={<ProjectOverview />} /> */}
          <Route path="/project/:id/overview" element={<ProjectOverview />} />
          <Route path="/project/:id/task" element={<Task />} />
          <Route path="/project/:id/kanban" element={<KanbanBoard />} />
          <Route path="/project/:id/file-sharing" element={<FileSharing />} />
          <Route path="/project/:id/notification" element={<NotificationList />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
