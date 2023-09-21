import "./App.css";
import Grid from "./color";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Grid />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
