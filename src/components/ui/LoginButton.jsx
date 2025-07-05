import { signInWithGoogle } from "../firebase";
import Button from "./ui/Button";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      console.log("User:", result.user);
      alert(`Hi ${result.user.displayName}`);
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return <Button onClick={handleLogin}>Login with Google</Button>;
};

export default LoginButton;
