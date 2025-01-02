import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useSocket } from "../context/socket-context";

interface Message {
  sender: string;
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const socket = useSocket();
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToLastMessage = useCallback(() => {
    const lastMessage = messagesRef.current!.lastElementChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message: Message) => {
      flushSync(() => {
        setMessages((prev) => [...prev, message]);
      });

      scrollToLastMessage();
    });

    return () => {
      socket.off("message");
    };
  }, [socket, scrollToLastMessage]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const newMessage = { sender: "You", content: input };
    socket!.emit("message", { content: input });

    flushSync(() => {
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    });

    scrollToLastMessage();
  };

  return (
    <div className="container h-screen pt-20">
      <div className="mx-auto max-w-[40rem] rounded-md border">
        <div className="rounded-t-md border-b bg-neutral-100 p-4">
          <h2 className="text-xl font-bold text-neutral-700">Tos Chat</h2>
        </div>

        <div className="py-4 [&>*]:px-4">
          <div
            ref={messagesRef}
            className="h-[384px] space-y-2 overflow-y-auto"
          >
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
