import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_PATH, MAIN_PAGE_PATH } from "../App";
import { postLogin } from "./request";

const AuthContext = createContext<{
  token: string | null;
  logIn: (login: string, password: string) => Promise<"Error" | null>;
  logOut: () => void;
} | null>(null);

export const AUTH_TOKEN_LOCALSTORAGE_PATH = "authToken";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(
    localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_PATH)
  );
  const navigate = useNavigate();
  const logIn = async (login: string, password: string) => {
    const token = await postLogin(login, password);
    if (token) {
      setToken(token);
      localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_PATH, token);
      navigate(MAIN_PAGE_PATH);
      return null;
    } else return "Error"; //TODO: add error parsing
  };

  const logOut = () => {
    setToken("");
    localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_PATH);
    navigate(LOGIN_PATH);
  };

  return (
    <AuthContext.Provider value={{ token, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("'useAuth' has to be used within <AuthContext.Provider>");
  } else return authContext;
};
