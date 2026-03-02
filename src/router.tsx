import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './views/Home'
import { Toaster } from 'sonner'
import AuthLayout from './layouts/AuthLayout'
import RegisterView from './views/auth/RegisterView'
import RequestNewCodeView from './views/auth/RequestNewCodeView'
import ConfirmAccountView from './views/auth/ConfirmAccountView'
import LoginView from './views/auth/LoginView'

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
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
