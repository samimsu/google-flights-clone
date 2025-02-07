import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import SearchPage from "./components/SearchPage/SearchPage";
import SearchResultsPage from "./components/SearchResultsPage/SearchResultsPage";
import BookingPage from "./components/BookingPage/BookingPage.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./mock/apis/getLocale.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="search" element={<SearchResultsPage />} />
        <Route path="booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
