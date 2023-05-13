import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import { Chat, Login, Register, SetAvatar } from "./pages";
import { useContext, useEffect, Suspense, lazy } from "react";
import { UserContext } from ".";
import setUser from "./services/setUser";

import styled from "styled-components";
import { loader } from "./assets";

const Chat = lazy(() => import("./pages/Chat/Chat"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const SetAvatar = lazy(() => import("./pages/SetAvatar/SetAvatar"));

export default function App() {
  const {
    setIsAuthenticated,
    isAuthenticated,
    userState,
    setUserState,

    setInitialCheckComplete,
  } = useContext(UserContext);
  const navigate = useNavigate();
  console.log(userState, isAuthenticated);
  useEffect(() => {
    async function authenticateUser() {
      const URLpathName = window.location.pathname;
      console.log(URLpathName);
      // Getting Token from Local Storage
      const token = localStorage.getItem("chat-app-token");
      if (token) {
        const data = await setUser(setUserState);
        console.log(data);
        if (!data.status) {
          setInitialCheckComplete(true);
          navigate(URLpathName === "/register" ? "/register" : "/login");
        } else {
          setIsAuthenticated(true);
          setInitialCheckComplete(true);
        }
      } else {
        setInitialCheckComplete(true);
        navigate(URLpathName === "/register" ? "/register" : "/login");
      }
    }
    authenticateUser();
  }, [navigate]);

  return (
    <Suspense
      fallback={
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      }
    >
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setavatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
      <ToastContainer />
    </Suspense>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
`;
