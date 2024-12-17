import { BackgroundBase } from "./components/BackgroundBase";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouterError from "./components/RouterError";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { TaskScreen } from "./components/TaskScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <BackgroundBase />
      <div className="relative z-10">

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <SignIn />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<SignIn />} errorElement={<RouterError />} />
              <Route path="register" element={<SignUp />} errorElement={<RouterError />} />

              <Route path="profile" element={<Profile />} errorElement={<RouterError />} />
              <Route path="task" element={<TaskScreen />} errorElement={<RouterError />} />
              <Route path="view" element={<CalendarScreen />} errorElement={<RouterError />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
