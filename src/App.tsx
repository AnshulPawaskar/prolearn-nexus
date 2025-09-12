import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import PrivateRoute from './components/PrivateRoute';
import Dashboard from "./pages/Dashboard";
import CourseList from "./pages/CourseList";
import EnrolledCourses from "./pages/EnrolledCourses";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import CoursePlayer from "./components/courses/CoursePlayerWrapper";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/courses" element={
            <PrivateRoute>
              <CourseList />
            </PrivateRoute>
          } />
          <Route path="/enrolled" element={
            <PrivateRoute>
              <EnrolledCourses />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/course/:id" element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/:lessonId" element={
            <PrivateRoute>
              <CoursePlayer />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
