import axios from "axios";
import { getUserRoute } from "../utils/APIRoutes";

export async function fetchUserAPI() {
  const { data } = await axios.post(getUserRoute, {
    token: localStorage.getItem("chat-app-token"),
  });
  return data;
}

/*
fetch(`${process.env.REACT_APP_HOST}auth/getuser`, {
    method: "POST",
    headers: { "auth-token": getToken() },
  });
*/
