import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Game from './game/Game';
import './main.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function MainApp() {
  return (
    <>
      <title>llm-trivia</title>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/game/:roomId" element={<Game />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MainApp />
);
