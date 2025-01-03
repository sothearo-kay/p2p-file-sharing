import { BrowserRouter, Route, Routes } from "react-router";
import { SocketProvider } from "./context/socket-context";
import RootLayout from "./layout";
import Chat from "./routes/chat";
import Home from "./routes/home";

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
