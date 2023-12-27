import "./App.css";
import EstimateRoom from "./pages/estimateRoom";
import StartForm from "./pages/startForm";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App"></div>
      <Routes>
        <Route path="/" element={<StartForm />} />
        <Route path="/vote" element={<EstimateRoom />} />
      </Routes>
    </Router>
  );
};

export default App;
