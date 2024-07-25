//import logo from './logo.svg';
import "./App.css";
import RootLayout from "./pages/RootLayout";
import DoodleLocal from "./pages/DoodleLocal";
import DoodleServer from "./pages/DoodleServer";
import CharacterLocal from "./pages/CharacterLocal";
import CharacterServer from "./pages/CharacterServer";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import RecaptchaTest from "./pages/RecaptchaTest";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // { index: true, element: <Navigate to="/DrawCanvas" replace /> },
            // { path: "/", element: <RootWin /> },
            // { path: "/login", element: <LoginWin /> },
            // { path: "/signup", element: <SignupWin /> },
            { path: "/DoodleLocal", element: <DoodleLocal /> },
            { path: "/DoodleServer", element: <DoodleServer /> },
            { path: "/CharacterLocal", element: <CharacterLocal /> },
            { path: "/CharacterServer", element: <CharacterServer /> },
        ],
    },
]);

function App() {
    return (
        <div>
        <RecaptchaTest />
        </div>
    );
}

export default App;
