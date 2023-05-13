import { Form } from "../../components";
const inputs = [
  { type: "username", name: "username", placeholder: "Username" },
  { type: "email", name: "email", placeholder: "Email" },
  { type: "password", name: "password", placeholder: "Password" },
  {
    type: "password",
    name: "confirmPassword",
    placeholder: "Confirm Password",
  },
];
export default function Register() {
  return (
    <>
      <Form variant="register" inputs={inputs} />
    </>
  );
}
