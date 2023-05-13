import { fetchUserAPI } from "./backendAPI";

export default async function setUser(setUserState) {
  const data = await fetchUserAPI();
  console.log(data);
  if (data.status) setUserState(data.user);
  return data;
}
