import { Form } from "../../components";
const inputs = [
  { type: "username", name: "username", placeholder: "Username" },
  { type: "password", name: "password", placeholder: "Password" },
];
export default function Login() {
  return (
    <>
      <Form variant="login" inputs={inputs} />
    </>
  );
}
