import { Routes, Route } from "react-router";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Pages/Dashboard";
import Task from "./Pages/Task";
import Project from "./Pages/Project";
import MultiStepForm from "./forms/Multistepform";
function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/task" element={<Task />} />
          <Route path="/project" element={<Project />} />
          <Route path="/create-project" element={<MultiStepForm />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
