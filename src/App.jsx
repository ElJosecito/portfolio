import "./assets/styles/tailwind.css";
import SubApp from "./SubApp";
import {Route, Routes} from "react-router-dom"
import Portfolio from "./assets/components/Portfolio components/Portfolio";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SubApp/>}></Route>
        <Route path="portafolio" element={<Portfolio/>}></Route>
      </Routes>
    </>
  );
}

export default App;
