
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./app/store.ts"
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </ReduxProvider>
)
