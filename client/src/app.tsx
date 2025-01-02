import { BrowserRouter, Route, Routes } from "react-router";
import { SocketProvider } from "./context/socket-context";
import Chat from "./routes/chat";
import Home from "./routes/home";

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
