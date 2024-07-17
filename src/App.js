//import logo from './logo.svg';
import "./App.css";
import RootWin from "./pages/RootWin";
import LoginWin from "./pages/LoginWin";
import SignupWin from "./pages/SignupWin";
import RootLayout from "./pages/RootLayout";
import Transaction from "./pages/Transaction";
import Merchant from "./pages/Merchant";
import Rule from "./pages/Rule";
import AddTransaction from "./pages/AddTransaction";
import AddMerchant from "./pages/AddMerchant";
import AddRule from "./pages/AddRule";
import AddItem from "./pages/AddItem";
import AddCategory from "./pages/AddCategory";
import Alert from "./pages/Alert";
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
