import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { io } from "socket.io-client";

const Chats = () => {
  const socket = useMemo(() => io(import.meta.env.VITE_BACKEND_URL), []);
  const { user } = useContext(AppContext);

  const [friends, setFriends] = useState([]);

  const [recipientEmail, setRecipientEmail] = useState("");

  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState("");

  const getFromFav = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getFromFav`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { data } = res.data;
      setFriends(data);
      console.log(data);
    } catch (error) {
      console.log("Error Fetching Friends", error);
    }
  };
  useEffect(() => {
    getFromFav();
  }, []);

  useEffect(() => {
    const onConnect = () => console.log("connected to: ", socket.id);
    const onDisconnect = () => console.log("Disconnected from:", socket.id);

    const onReceiveMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        { ...message, senderEmail: message.senderEmail || user.email },
      ]);
    };

    const onRecipientOffline = (email) => {
      toast.error(`${email} is offline`);
    };
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);
    socket.on("recipient-offline", onRecipientOffline);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
      socket.off("recipient-offline", onRecipientOffline);
    };
  }, [socket, user.email]);

  const initaiteChat = (email) => {
    setRecipientEmail(email);
    toast.success(`Chat with  ${recipientEmail}`);
    socket.emit("initiate-chat", {
      senderEmail: user.email,
      recipientEmail: email,
    });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    socket.emit("send-message", {
      senderEmail: user.email,
      recipientEmail: recipientEmail,
      message: inputMessage,
    });
    setMessages((prev) => [
      ...prev,
      { message: inputMessage, senderEmail: user.email },
    ]);
    setInputMessage("");
  };

  return (
    <div className="flex mx-10  flex-col md:flex-row justify-evenly items-center">
      <div className="w-screen overflow-x-hidden sm:overflow-x sm:w-[50%] my-6 p-3">
        <h1 className="text-3xl font-bold mb-4 text-white">Chats</h1>
        <div className="w-full flex flex-wrap gap-4 justify-center items-center md:justify-start">
          {friends?.map((friend) => (
            <div
              className={`bg-white w-36 p-4 rounded-lg ${
                recipientEmail === friend?.email &&
                "shadow-primary shadow-inner"
              }`}
              key={friend?._id}
              onClick={() => {
                initaiteChat(friend?.email);
              }}
            >
              <img
                src={friend?.profile}
                alt={friend?.name}
                className="w-20 h-20 rounded-full mx-auto"
              />
              <h1 className="text-center  text-black mt-2 font-bold">
                {friend?.name}
              </h1>
            </div>
          ))}
        </div>
      </div>
      <div className="w-[90vw] md:w-[60vw] h-[80vh] shadow-primary shadow-inner my-10 rounded-lg relative">
        <h1 className="text-white w-full text-xl font-bold p-4 bg-primary rounded-tl-md rounded-tr-md font-RopaSan">
          {recipientEmail || "Chats"}
        </h1>
        <div className="h-[80%] overflow-y-scroll p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderEmail === user.email
                  ? "justify-end"
                  : "justify-start"
              } mb-4`}
            >
              <div
                className={`bg-${
                  message.senderEmail === user.email ? "primary" : "white"
                } text-${
                  message.senderEmail === user.email ? "white" : "black"
                } p-2 w-fit rounded-lg ${
                  message.senderEmail === user.email
                    ? "rounded-tr-none ml-auto"
                    : "rounded-tl-none"
                }`}
              >
                <span>{message.senderEmail}</span>
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-1 left-0 right-0 flex items-center justify-center  rounded-b-lg gap-2 px-8 py-2">
          <input
            type="text"
            name="message"
            className="w-[90%] py-2 rounded-lg px-4 outline-none"
            placeholder="type a message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-white py-2 font-RopaSan px-5 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chats;
