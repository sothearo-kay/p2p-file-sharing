import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      const response = await fetch("/api");
      const data = await response.json();
      setData(data);
    })();
  }, []);

  return <div>{JSON.stringify(data)}</div>;
}

export default App;
