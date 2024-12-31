import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(`http://${import.meta.env.VITE_YOUR_IP}:3000`);
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = { sender: "You", content: input };
    socketRef.current!.emit("message", { content: input });

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="container h-screen pt-20">
      <div className="mx-auto max-w-[40rem] rounded-md border">
        <div className="rounded-t-md border-b bg-neutral-100 p-4">
          <h2 className="text-xl font-bold text-neutral-700">Tos Chat</h2>
        </div>

        <div className="p-4">
          <div className="h-[384px] space-y-2 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    message.sender === "You"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-green-100 text-green-900"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <form onSubmit={sendMessage} className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow rounded-md border border-gray-300 px-4 py-2 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-neutral-800"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
