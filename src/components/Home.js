import React from "react";
import { Routes , Route,  BrowserRouter } from "react-router-dom";

import App from "./App";
import DashBorad from "./DashBoard";
import Error from "./Error";
import Logout from "./Logout";

export default function Home() {
    return (
        <>
            <BrowserRouter>
                <Routes >
                    <Route  path="/" element={<DashBorad />} />
                    <Route  path="/app" element={<App />} />
                    <Route  path="/logout" element={<Logout />} />
                    <Route component={Error} />
                </Routes>
            </BrowserRouter>
        </>
    )
}