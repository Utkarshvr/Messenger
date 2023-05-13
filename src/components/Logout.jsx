import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import { useContext } from "react";
import { UserContext } from "..";
export default function Logout() {
  const navigate = useNavigate();

  const { setUserState, setIsAuthenticated } = useContext(UserContext);

  const handleClick = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserState(null);
    if (localStorage.length < 1) navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
