import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './views/Home'
import { Toaster } from 'sonner'
import AuthLayout from './layouts/AuthLayout'
import RegisterView from './views/auth/RegisterView'
import RequestNewCodeView from './views/auth/RequestNewCodeView'
import ConfirmAccountView from './views/auth/ConfirmAccountView'
import LoginView from './views/auth/LoginView'
import MainLayout from './layouts/MainLayout'
import ProfileView from './views/user/ProfileView'
import ForgotPasswordView from './views/auth/ForgotPasswordView'
import NewPasswordView from './views/auth/NewPasswordView'

export default function Router() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterView />} />
                    <Route path="/request-code" element={<RequestNewCodeView />} />
                    <Route path="/confirm-account" element={<ConfirmAccountView />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/forgot-password" element={<ForgotPasswordView />} />
                    <Route path="/new-password" element={<NewPasswordView />} />
                </Route>

                <Route path='/bar' element={<MainLayout />}>
                    <Route index element={<ProfileView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
