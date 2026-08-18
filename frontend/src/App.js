import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage"
import HomePage from './pages/HomePage';
import ProfilePage from "./pages/ProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage"
import SettingsPage from "./pages/SettingsPage";
import ReviewsPage from "./pages/ReviewPage";
import Footer from './components/Footer';
import NewReviewPage from "./pages/NewReviewPage"
import EditReviewPage from "./pages/EditReviewPage"
import ErrorPage from './pages/ErrorPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CheckEmailPage from './pages/CheckEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import './App.css';

const App = () => {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
            <ProtectedRoute>
              <Navbar />
              <HomePage />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
          <ProtectedRoute>
            <AppLayout>
              <PublicProfilePage />
            </AppLayout>
          </ProtectedRoute>
          }
        />
        
        <Route
          path="/reviews/new/:entryId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NewReviewPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
              
        <Route
          path="/reviews/:reviewId/edit"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditReviewPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
              
        <Route
          path="/reviews/:reviewId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReviewsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="*" element={<ErrorPage statusCode={404} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    );
};

export default App;
