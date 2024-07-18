//import logo from './logo.svg';
import "./App.css";
import RootWin from "./pages/RootWin";
import LoginWin from "./pages/LoginWin";
import SignupWin from "./pages/SignupWin";
import RootLayout from "./pages/RootLayout";
import DrawCanvas from "./pages/DrawCanvas";
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { path: "/", element: <RootWin /> },
            { path: "/login", element: <LoginWin /> },
            { path: "/signup", element: <SignupWin /> },
            { path: "/DrawCanvas", element: <DrawCanvas /> }
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
