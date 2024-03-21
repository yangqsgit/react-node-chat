import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WithLogin from "./hoc/WithLogin";
const Home = lazy(() => import('@pages/home'))
export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Suspense>
                    <WithLogin><Home /></WithLogin>
                </Suspense>} />
                <Route path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}