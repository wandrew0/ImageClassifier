import React, {useEffect, useState} from 'react';
import InputWithRequirements from "./InputWithRequirements";
/*
  lessons learned from debugging infinite re-rendering and invalid state. How react works.
  useState is called in first render
  event.target.value contains the new value,
  but after setPassword is called, the password state does not have the new value until the re-render.
  if print('password') immediately after setPassword, it shows the previous state value.
  as setPassword changes password state, a re-rendering takes place, when password takes the new value.
  don't call setXXX in normal rendering code, as it will get into an infinite loop of re-rendering->change state->re-rendering.
  useEffect() is used when you want to re-render the tag based on its attribute change as in deps[] array.
  also to maintain state between rendering, the variable should useState().
 */
const PasswordWithRequirements = ({resetVal, isGoodPassword}) => {
    console.log("PasswordWithRequirements renders");

    const lengthReq = "at least 8 characters long";
    const capitalReq = "at least 1 upper-case letter";
    const lowerReq = "at least 1 lower-case letter";
    const numberReq = "at least 1 number";
    const [password, setPassword] = useState('');

    const [requirements, setRequirements] = useState([
        {checked: false, label: lengthReq},
        {checked: false, label: capitalReq},
        {checked: false, label: lowerReq},
        {checked: false, label: numberReq},
    ]);

    useEffect(() => {
        console.log("useEffect");
        console.log("resetVal:" + resetVal);
        console.log("password:" + password);
        setPassword('');
        setRequirements([
            {checked: false, label: numberReq},
            {checked: false, label: capitalReq},
            {checked: false, label: lowerReq},
            {checked: false, label: lengthReq},
        ])
        isGoodPassword(false);

    }, [resetVal]);


    return (
        <div>
            <label className="labelText" htmlFor="password">Password</label>
            <input autoComplete="new-password"
                   id="password"
                   type="password" name="password" value={password} onChange={(e) => {
                setPassword(e.target.value);
                var newPassword = e.target.value;
                setRequirements([
                    {checked: newPassword.length >= 8, label: lengthReq},
                    {checked: /[A-Z]/.test(newPassword), label: capitalReq},
                    {checked: /[a-z]/.test(newPassword), label: lowerReq},
                    {checked: /\d/.test(newPassword), label: numberReq}
                ]);
                var goodPassword = newPassword.length >= 8 && /\d/.test(newPassword)
                && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
                console.log("goodpassword" + goodPassword);
                isGoodPassword(goodPassword);

            }}
            />
            <InputWithRequirements requirements={requirements} />
        </div>
    )
}


export default PasswordWithRequirements;