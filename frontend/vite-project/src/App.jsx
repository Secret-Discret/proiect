import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./FirstAttack/Landing.jsx";
import SelectAdvisors from "./FirstAttack/SelectAdvisors.jsx";
import Attack from "./FirstAttack/Attack.jsx";
import ShowMath from "./FirstAttack/ShowMath.jsx";
import MultiLanding from "./ReleaseInfo/Landing.jsx";
import SelectRedactors from "./ReleaseInfo/SelectRedactors.jsx";
import MathUI from "./ReleaseInfo/ShowMath.jsx";
import SelectSecret from "./ReleaseInfo/SelectSecret.jsx";
import TransitionScreen from "./ReleaseInfo/TransitionScreen.jsx";
import AttackPosts from "./ReleaseInfo/AttackPosts.jsx";
import ShamirLanding from "./SimpleShamir/Landing.jsx";
import ShamirTransition from "./SimpleShamir/TransitionScreen.jsx";
import ShamirDecodeMath from "./SimpleShamir/ShowMath.jsx";
import Header from "./NavigationComponents/Header.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/advisors" element={<SelectAdvisors />} />
        <Route path="/attack" element={<Attack />} />
        <Route path="/math" element={<ShowMath />} />
        <Route path="/second" element={<MultiLanding />} />
        <Route path="/second/transition" element={<TransitionScreen />} />
        <Route path="/second/redactors" element={<SelectRedactors />} />
        <Route path="/second/select-secret" element={<SelectSecret />} />
        <Route path="/second/math" element={<MathUI />} />
        <Route path="/second/attack" element={<AttackPosts />} />
        <Route path="/simple" element={<ShamirLanding />} />
        <Route path="/simple/transition" element={<ShamirTransition />} />
        <Route path="/simple/math" element={<ShamirDecodeMath />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
