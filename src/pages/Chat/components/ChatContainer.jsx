import { useState, useEffect, useRef } from "react";
import { Logout } from "../../../components";
import styled from "styled-components";
import { ChatInput } from "./";
import axios from "axios";
import {
  getAllMessagesRoute,
  sendMessageRoute,
} from "../../../utils/APIRoutes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const toastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  // Send Msg
  const handleSendMsg = async (msg) => {
    const { data } = await axios.post(sendMessageRoute, {
      token: localStorage.getItem("chat-app-token"),
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    if (!data.status) {
      return toast.error("An Error Occur While Sending Message", toastOptions);
    }
    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    setMessages((prevMsg) => [...prevMsg, { fromSelf: true, message: msg }]);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prevMsg) => [...prevMsg, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavious: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchAllMsgs = async () => {
      const { data } = await axios.post(getAllMessagesRoute, {
        token: localStorage.getItem("chat-app-token"),
        from: currentUser._id,
        to: currentChat._id,
      });
      if (!data.status) {
        return toast.error(
          "An Error Occur While Fetching Message",
          toastOptions
        );
      }
      setMessages(data.messages);
    };
    fetchAllMsgs();
  }, [currentChat]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => {
          return (
            <div key={i}>
              <div
                className={`message ${msg?.fromSelf ? "sended" : "recieved"}`}
              >
                <div className="content">
                  <p>{msg?.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem;
    height: 100%;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: 100%;
      .avatar {
        height: 100%;
        img {
          max-height: 3rem;
          height: 100%;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
