import Button from "../components/Button";
import LoginEditor from "../components/LoginEditor";

const Login = () => {
  return (
    <>
      <h2>Login</h2>
      <div>
        <Button text={"개인"} isVisible={true} />
        <Button text={"사업자"} isVisible={true} />
      </div>

      <LoginEditor />
    </>
  );
};
export default Login;