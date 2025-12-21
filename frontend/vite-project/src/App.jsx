import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./FirstAttack/Landing.jsx";
import SelectAdvisors from "./FirstAttack/SelectAdvisors.jsx";
import Attack from "./FirstAttack/Attack.jsx";
import ShowMath from "./FirstAttack/ShowMath.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/advisors" element={<SelectAdvisors />} />
        <Route path="/attack" element={<Attack />} />
        <Route path="/math" element={<ShowMath />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
