import { fetchUserAPI } from "./backendAPI";

export default async function setUser(setUserState) {
  const data = await fetchUserAPI();
  if (data.status) setUserState(data.user);
  return data;
}
