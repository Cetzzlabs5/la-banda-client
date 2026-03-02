import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './views/Home'
import { Toaster } from 'sonner'
import AuthLayout from './layouts/AuthLayout'
import RegisterView from './views/auth/RegisterView'

export default function Router() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<AuthLayout />}>
                    <Route path="/register" element={<RegisterView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
