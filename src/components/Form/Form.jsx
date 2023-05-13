import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { logo } from "../../assets";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute, registerRoute } from "../../utils/APIRoutes";
import { UserContext } from "../..";
import setUser from "../../services/setUser";
const toastOptions = {
  position: "bottom-right",
  autoClose: 4000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
export default function Form({ variant, inputs }) {
  const [value, setValue] = useState(
    variant === "register"
      ? {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }
      : {
          email: "",
          password: "",
        }
  );
  const [isLoaded, setIsLoaded] = useState(true);
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(UserContext);

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      navigate("/");
      toast.info("You are already logged in", toastOptions);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submitted");
    if (handleValidation()) {
      setIsLoaded(false);
      console.log("inside validation");
      if (variant === "register") {
        const { password, username, email } = value;
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
        console.log(data);
        if (data.status === false) {
          setIsLoaded(true);
          toast.error(data.msg, toastOptions);
        } else {
          setIsLoaded(true);
          localStorage.setItem("chat-app-token", data.token);
          setIsAuthenticated(true);
          navigate("/");
          toast.success("Registered Successfully", toastOptions);
        }
      } else {
        const { password, username } = value;
        const { data } = await axios.post(loginRoute, { username, password });
        if (data.status === false) {
          setIsLoaded(true);
          toast.error(data.msg, toastOptions);
        } else {
          setIsLoaded(true);
          localStorage.setItem("chat-app-token", data.token);
          setIsAuthenticated(true);
          navigate("/");

          toast.success("Loggedin Successfully", toastOptions);
        }
      }
    }
  };

  const handleChange = (e) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = value;

    if (variant === "register") {
      if (password !== confirmPassword) {
        toast.error(
          "Password and confirm password should be same.",
          toastOptions
        );
        return false;
      }
      if (username.length < 3) {
        toast.error(
          "Username should be greater than 3 characters.",
          toastOptions
        );
        return false;
      }
      if (password.length < 8) {
        toast.error(
          "Password should be equal or greater than 8 characters.",
          toastOptions
        );
        return false;
      }
      if (email === "") {
        toast.error("Email is required.", toastOptions);
        return false;
      }

      return true;
    } else {
      if (password === "") {
        toast.error("Username & Password is required.", toastOptions);
        return false;
      }
      if (username === "") {
        toast.error("Username & Password is required.", toastOptions);
        return false;
      }
      return true;
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={logo} alt="img" />
            <h1>snappy</h1>
          </div>
          {inputs.map(({ type, name, placeholder }, i) => (
            <input
              value={value.name}
              key={i}
              type={type}
              name={name}
              placeholder={placeholder}
              onChange={(e) => handleChange(e)}
            />
          ))}
          <button disabled={!isLoaded} type="submit">
            {variant === "register" ? "Register" : "Login"}
          </button>
          {variant === "register" ? (
            <span>
              Don't have an account ? <Link to="/login">Login</Link>
            </span>
          ) : (
            <span>
              Already have an account ? <Link to="/register">Register</Link>
            </span>
          )}
        </form>
      </FormContainer>
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
    &:disabled {
      background-color: #6f51c1;
      color: #959595;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
