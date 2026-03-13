import { Routes, Route } from "react-router-dom";
import ConsultationCall from "./vc/jsx/ConsultationCall";

function App() {
  return (
    <Routes>
      <Route path="/consultation/:roomId" element={<ConsultationCall />} />
    </Routes>
  );
}

export default App;