//import logo from './logo.svg';
import "./App.css";
import RootLayout from "./pages/RootLayout";
import DrawCanvas from "./pages/DrawCanvas";
import DrawCanvasServer from "./pages/DrawCanvasServer";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // { index: true, element: <Navigate to="/DrawCanvas" replace /> },
            // { path: "/", element: <RootWin /> },
            // { path: "/login", element: <LoginWin /> },
            // { path: "/signup", element: <SignupWin /> },
            { path: "/DrawCanvas", element: <DrawCanvas /> },
            { path: "/DrawCanvasServer", element: <DrawCanvasServer /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
