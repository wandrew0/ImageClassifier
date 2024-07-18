//import logo from './logo.svg';
import "./App.css";
import RootWin from "./pages/RootWin";
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
            { path: "/DrawCanvas", element: <DrawCanvas /> }
        ]
    }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
