import { useEffect, useState } from "react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Heading from "@/components/ui/Heading";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

const Login = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.themoviedb.org/3/authentication/token/new",
        {
          params: { api_key: import.meta.env.VITE_APP_API_KEY },
        }
      );
      const request_token = response.data.request_token;
      if (request_token) {
        window.location.href = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${window.location.origin}/login`;
      } else {
        throw new Error("No request token found.");
      }
    } catch (error) {
      console.error("Error generating request token:", error);
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    setTimeout(() => navigate("/", { replace: true }), 3000);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestToken = params.get("request_token");

    if (requestToken) {
      const createSession = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            "https://api.themoviedb.org/3/authentication/session/new",
            { request_token: requestToken },
            {
              params: { api_key: import.meta.env.VITE_APP_API_KEY },
            }
          );
          const session_id = response.data.session_id;
          if (session_id) {
            localStorage.setItem("session_id", session_id);
            setIsLogged(true);
            handleNavigate();
          } else {
            throw new Error("Session creation failed.");
          }
        } catch (error) {
          console.error("Error creating session:", error);
          setLoading(false);
        }
      };

      createSession();
    }
  }, [navigate]);

  return (
    <div className="w-screen h-screen px-6 md:px-0 flex justify-center items-center">
      {loading && (
        <div className="bg-secondary-dark w-[500px] p-10 flex flex-col justify-center items-center gap-6 rounded-xl">
          <div className="w-14 h-14 border-[5px] border-t-orange rounded-full border-[#ffffff90] animate-spin" />
          <Heading as="h1" className="mt-0">
            Logging in...
          </Heading>
        </div>
      )}

      {!loading && !isLogged && (
        <div className="bg-secondary-dark w-[500px] p-10 flex flex-col justify-center gap-6 rounded-xl">
          <Heading as="h1" className="-mt-1">
            Login
          </Heading>
          <Text>Please click the login button to create a new session.</Text>
          <Button className="w-full py-4" onClick={handleLogin}>
            Login with TMDB
          </Button>
        </div>
      )}

      {isLogged && !loading && (
        <div className="bg-secondary-dark w-[500px] p-10 flex flex-col justify-center gap-6 rounded-xl">
          <div className="flex flex-col items-center justify-center gap-6">
            <IoIosCheckmarkCircleOutline className="text-6xl text-orange" />
            <Heading as="h1" className="text-center">
              You are now logged in.
            </Heading>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
