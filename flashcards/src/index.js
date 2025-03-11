import "bootstrap/dist/css/bootstrap.min.css"
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ContextProvider from './Context';
import {BrowserRouter, } from "react-router-dom"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
          <App />
        </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
