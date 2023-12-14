import "./App.css";
import VoteForm from "./pages/voteForm";
import StartForm from "./pages/startForm";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App"></div>
      <Routes>
        <Route path="/" element={<StartForm />} />
        <Route path="/vote" element={<VoteForm />} />
      </Routes>
    </Router>
  );
};

export default App;
