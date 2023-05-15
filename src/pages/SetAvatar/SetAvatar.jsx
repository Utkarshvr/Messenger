import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "styled-components";
import { loader } from "../../assets";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { setAvatarRoute } from "../../utils/APIRoutes";
import { Buffer } from "buffer";
import { UserContext } from "../..";
const api = "https://api.multiavatar.com/3546463243242323";
const toastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function SetAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const token = localStorage.getItem("chat-app-token");

  const navigate = useNavigate();

  const {
    isAuthenticated,
    userState,
    initialCheckComplete,
    setInitialCheckComplete,
  } = useContext(UserContext);

  const setProfilePicture = async () => {
    if (selectedAvatar === null || undefined) {
      return toast.error("Please select an avatar", toastOptions);
    } else {
      const { data } = await axios.post(setAvatarRoute, {
        token,
        image: avatars[selectedAvatar],
      });
      if (data.status) {
        localStorage.setItem("chat-app-token", data.token);
        // SOmething
        setInitialCheckComplete(false);
        navigate("/");
        toast.success("Avatar Set Successfully", toastOptions);
      } else {
        toast.error(
          "An error occured while setting avatar. Please try again.",
          toastOptions
        );
      }
    }
  };

  useEffect(() => {
    if (initialCheckComplete) {
      if (!isAuthenticated || !token) {
        navigate("/");
      }
      if (userState?.isAvatarImageSet) navigate("/");
    }
  }, [initialCheckComplete]);
  useEffect(() => {
    const func = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    func();
  }, []);
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={avatar}
                  onClick={() => setSelectedAvatar(index)}
                  className={`avatar ${selectedAvatar === index && "selected"}`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      text-align: center;
      color: white;
    }
  }
  .avatars {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    .avatar {
      cursor: pointer;
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
