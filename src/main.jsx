import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "@/App";
import SelectLevel from "@/pages/SelectLevel";
import About from "@/pages/About";
import Completion from "@/pages/Completion";
import "@/index.css";

import LevelOne from "@/pages/LevelOne";
import LevelTwo from "@/pages/LevelTwo";
import LevelThree from "@/pages/LevelThree";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/select-level" element={<SelectLevel />} />
                <Route path="/level-one" element={<LevelOne />} />
                <Route path="/level-two" element={<LevelTwo />} />
                <Route path="/level-three" element={<LevelThree />} />
                <Route path="/about" element={<About />} />
                <Route path="/Completion" element={<Completion />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);