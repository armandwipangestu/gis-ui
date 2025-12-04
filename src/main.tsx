import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// import BrowserRouter from react router
import { BrowserRouter } from "react-router";

// import QueryClient and QueryClientProvider from react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import ReactQueryDevtools from react-query-devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Initialize QueryClient
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
