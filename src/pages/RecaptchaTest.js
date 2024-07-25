import {ReCAPTCHA} from "react-google-recaptcha";
import {useRef, useState} from "react";
import {useEffect} from "react";


const RecaptchaTest = () => {
    const SITE_KEY= "6LduixgqAAAAANHUz1xvlkZw8ZC96ZhrKjqbNjHk";
    const [recaptchaValue, setRecaptchaValue] = useState(null);

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
        setRecaptchaValue(value);
    };
    useEffect(() => {
        window.handleRecaptcha = handleRecaptcha;

        return () => {
            delete window.handleRecaptcha;
        };
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with reCAPTCHA value:', recaptchaValue);
        if (!recaptchaValue) {
            alert('Please complete the reCAPTCHA');
            return;
        }
        // Proceed with form submission or further validation

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
    return (
        <div style={styles.container}>
        <form onSubmit={handleSubmit}>
            <div className="g-recaptcha" data-sitekey={SITE_KEY}
                 data-callback="handleRecaptcha" />
            <button type="submit" style={styles.button}>Submit</button>
        </form>
            </div>
    )

}
export default RecaptchaTest;
