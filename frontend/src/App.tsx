import TemperatureChart from "./components/TemperatureChart";

import { useTemperatureData } from "./hooks/useTemperatureData";

function App() {
  const temperature_in_realtime = useTemperatureData();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Monitor de Temperatura</h1>
      <TemperatureChart data={temperature_in_realtime} />
    </div>
  );
}

export default App;
