import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts";
import {
  SignInPage,
  SignUpPage,
  TaskPage,
  CalendarPage,
  ProfilePage,
  NotFoundPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EmailVerificationPage,
  AnalyticsPage,
} from "./pages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ROUTES } from "./constants/constants";

// App routing setup
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route
            index
            element={
              <TaskPage />
            }
          />
          <Route path={ROUTES.LOGIN} element={<SignInPage />} />
          <Route path={ROUTES.REGISTER} element={<SignUpPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.EMAIL_VERIFICATION} element={<EmailVerificationPage />} />
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
              <TaskPage />
            }
          />
          <Route
            path={ROUTES.CALENDAR}
            element={
              <CalendarPage />
            }
          />
          <Route path={ROUTES.ANALYTICS} element={
            <AnalyticsPage />
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
