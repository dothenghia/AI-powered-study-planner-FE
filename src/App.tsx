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
import { BackgroundBase } from "./components/BackgroundBase";

function App() {
  return (
    <>
      <BackgroundBase />
      <div className="relative z-10">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <SignInPage />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<SignInPage />} />
              <Route path="register" element={<SignUpPage />} />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="task" 
                element={
                  <ProtectedRoute>
                    <TaskPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="view" 
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
      </div>
    </>
  );
}

export default App;
