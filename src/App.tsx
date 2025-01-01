import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import {
  SignInPage,
  SignUpPage,
  TaskPage,
  CalendarPage,
  ProfilePage,
  NotFoundPage
} from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROUTES } from "./utils/constants";

// App routing setup
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.LOGIN} element={<SignInPage />} />
          <Route path={ROUTES.REGISTER} element={<SignUpPage />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TASK}
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CALENDAR}
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
