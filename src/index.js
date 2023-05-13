import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { createContext, useState } from "react";
const root = ReactDOM.createRoot(document.getElementById("root"));

export const UserContext = createContext();

const AppWrapper = () => {
  const [userState, setUserState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserState,
        isAuthenticated,
        setIsAuthenticated,
        initialCheckComplete,
        setInitialCheckComplete,
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

root.render(<AppWrapper />);
