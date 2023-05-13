import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { allUsersRoute, host } from "../../utils/APIRoutes";
import { UserContext } from "../..";
import { ChatContainer, Contacts } from "./components";
import { useNavigate } from "react-router-dom";
import { Welcome } from "../../components";
import { io } from "socket.io-client";

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { userState } = useContext(UserContext);
  const navigate = useNavigate();

  const socket = useRef();

  useEffect(() => {
    const func = async () => {
      if (userState?.isAvatarImageSet) {
        const { data } = await axios.post(allUsersRoute, {
          token: localStorage.getItem("chat-app-token"),
        });
        if (data.status) {
          setContacts(data.users);
        }
      } else {
        navigate("/setavatar");
      }
    };
    func();
  }, [userState]);

  useEffect(() => {
    if (userState) {
      socket.current = io(host);
      socket.current.emit("add-user", userState._id);
    }
  }, [userState]);

  const handeChangeChat = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            changeChat={handeChangeChat}
            contacts={contacts}
            currentUser={userState}
          />
          {!isLoaded && currentChat === null ? (
            <Welcome currentUser={userState} />
          ) : (
            <ChatContainer
              socket={socket}
              currentChat={currentChat}
              currentUser={userState}
            />
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 30% 70%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
