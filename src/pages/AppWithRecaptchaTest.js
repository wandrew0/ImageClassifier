import {ReCAPTCHA} from "react-google-recaptcha";
import {useRef, useState} from "react";
import {useEffect} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./RootLayout";
import DoodleLocal from "./DoodleLocal";
import DoodleServer from "./DoodleServer";
import CharacterLocal from "./CharacterLocal";
import CharacterServer from "./CharacterServer";
import ErrorBoundary from "../ErrorBoundary";
import RootWin from "./RootWin";
const newRouter = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // { index: true, element: <Navigate to="/DrawCanvas" replace /> },
            // { path: "/", element: <RootWin /> },
            // { path: "/login", element: <LoginWin /> },
            // { path: "/signup", element: <SignupWin /> },
            { path: "/", element: <RootWin /> },
            { path: "/DoodleLocal", element: <DoodleLocal /> },
            { path: "/DoodleServer", element: <DoodleServer /> },
            { path: "/CharacterLocal", element: <CharacterLocal /> },
            { path: "/CharacterServer", element: <CharacterServer /> },
        ],
    },
]);

const AppWithRecaptchaTest = () => {
    const SITE_KEY= "6LduixgqAAAAANHUz1xvlkZw8ZC96ZhrKjqbNjHk";
    const [isHuman, setIsHuman] = useState(false);
    // script1.js
    function loadScript(url) {
        var script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }

// Load another script
    loadScript('https://www.google.com/recaptcha/api.js');

// Your code here


    const  handleRecaptcha = (value) => {
        console.log('Captcha value:', value);
    };

    useEffect(() => {
        window.handleRecaptcha = handleRecaptcha;
        return () => {};
    }, []);


    const callApi = async (path, body) => {
        const headers = { "Content-Type": "application/json" };

        const url = "http://" + window.location.hostname + ":2000" + path;

        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        return response;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsHuman(true);
        /*
        console.log("response value:" + grecaptcha.getResponse());
        console.log('Form submitted with reCAPTCHA value:', recaptchaValue);
        if (!recaptchaValue) {
            alert('Please complete the reCAPTCHA');
            return;
        }
        // Proceed with form submission or further validation
        const response =  callApi("/api/recaptcha/verify", {
            token: recaptchaValue
        });

        response.then((d) => {//console.log("response:" + d);
            d.json().then((jsonD) => {console.log("response:" + jsonD)})
                .catch((jsonError) => {console.log("error in json:" + jsonError)})})
            .catch((error) => {console.log("error:" + error)});

         */


    };
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
        },
        button: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
            marginTop: '20px',
        },

    };
    if (isHuman) {
        return (
            <RouterProvider router={newRouter} />

        )
    } else {
        return (
            <div style={styles.container}>
                <form onSubmit={handleSubmit}>
                    <div class="g-recaptcha" data-sitekey={SITE_KEY}
                         data-callback="handleRecaptcha"/>
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>

        )
    }

}
export default AppWithRecaptchaTest;
