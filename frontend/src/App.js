import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import QuotationForm from "@/pages/QuotationForm";
import QuotationView from "@/pages/QuotationView";
import HistoryPage from "@/pages/HistoryPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuotationForm />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/quotation/:id" element={<QuotationView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;
