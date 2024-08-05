import {useState} from "react";
import {useEffect} from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./RootLayout";
import DoodleLocal from "./DoodleLocal";
import DoodleServer from "./DoodleServer";
import CharacterLocal from "./CharacterLocal";
import CharacterServer from "./CharacterServer";
import RootWin from "./RootWin";
import {MainContextProvider, useMainContext} from "./MainContext";
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
    const [token, setToken] = useState('');
    const {key, setKey} = useMainContext();
    // script1.js
    function loadScript(url) {
        var script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
    }

// Load another script
    loadScript('https://www.google.com/recaptcha/api.js');

// Your code here
    console.log("key is " + key);


    const  handleRecaptcha = (value) => {
        //console.log('Captcha value:', value);
        setToken(value);
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

        //console.log("response value:" + grecaptcha.getResponse());

        // Proceed with form submission or further validation
        const response =  callApi("/api/recaptcha/verify", {
            token: token,
        });

        response.then((d) => {//console.log("response:" + d);
            d.json().then((data) => {
                console.log("response:" + data.status);
                if (data.status === "success") {
                    console.log(data.api_key);
                    setKey(data.api_key);
                    setIsHuman(true);
                }
            })
                .catch((jsonError) => {console.log("error in json:" + jsonError)})})
            .catch((error) => {console.log("error:" + error)});


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
                <form  onSubmit={handleSubmit}>
                    <div class="g-recaptcha" data-sitekey={SITE_KEY}
                         data-callback="handleRecaptcha"/>
                    <br />
                    <input type="submit" value="Submit" style={{
                        backgroundColor: 'black',
                        border: 'none',
                        color: 'white',
                        padding: '15px 32px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontSize: '16px',
                        margin: '4px 2px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        align: 'center',
                        textAlign: 'center'
                    }}
                    />
                </form>
            </div>


        )
    }

}
export default AppWithRecaptchaTest;
