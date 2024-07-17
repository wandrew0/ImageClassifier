
import React, {useEffect} from "react";
import ErrorBox from './ErrorBox';
import { jsonFetch, buildIpAddress } from "../components/common";
import MainContext from "./MainContext"
import { Link } from "react-router-dom";
import PasswordWithRequirements from "../components/PasswordWithRequirements";

const SignupWin = () => {

  console.log("SignupWin renders");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [errmsg, setErrmsg] = React.useState("");
  const [resetVal, setResetVal] = React.useState(0)
  const [goodPassword, setGoodPassword] = React.useState(false);
  const [goodForm, setGoodForm] = React.useState(false);



  function firstNameChange(e) { setFirstName(e.target.value) }
  function lastNameChange(e) { setLastName(e.target.value) }
  function emailChange(e) { setEmail(e.target.value) }

  useEffect(() => {
    setGoodForm(goodPassword && lastName && firstName && isValidEmail(email));
  }, [goodPassword, lastName, email, firstName, email]);

  const ctx = React.useContext(MainContext);
  function resetHandle() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setResetVal(prevState => prevState + 1);
    setGoodForm(false);
  }
  function handleErrorClose()  {
    setErrmsg(''); // Clear the error message, hiding the error box
  };
  function isValidEmail(email) {
    //console.log('check : %s', email);
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

    
  function handleSubmit(event) {
    event.preventDefault();
    
    const fd = new FormData(event.target);
    // const ..= fd.getAll("multiple")  //for same name, diff value
    const data = Object.fromEntries(fd.entries());
    if (!isValidEmail(data.email)) {
      console.log("invalid email: %s", data.email);
      setErrmsg("invalid email:" + data.email);
      return;
    }
    console.log("password:" + data.password);
    if (!goodPassword) {
      console.log("invaid password");
      setErrmsg("invalid password");
      return;
    }

    // const postdata = new FormData();
    // postdata.append("first_name", data.firstname);
    // postdata.append("last_name", data.lastname);
    // postdata.append("email", data.email);
    // postdata.append("password", data.password);
    const postdata = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      password: data.password
    }
    
    // console.log("data=", data, "post=", postdata);
    const filename = buildIpAddress(3000, "/api/v1/customer/signup");
    //const filename = "http://127.0.0.1:3000/api/v1/customer"
    jsonFetch(filename, postdata)
      .then((d) => {
        // console.log("d=", d);
        d.json()
          .then((json) => {
            // console.log("got json: ", json);
            if (json.status === "success") {
              // console.log('good');
              localStorage.setItem("first_name", json.data.first_name)
              localStorage.setItem("last_name", json.data.last_name)
              localStorage.setItem("email", json.data.email)
              localStorage.setItem("token", json.token)
              ctx.setActive1("1");
              setErrmsg(<p>Success! Next step:  <Link to="/add_item">add bank accounts</Link></p>);
            } else {
              setErrmsg(json.message);
            }
          })
      }).catch((err) => {
        // console.log("ERROR(signup)", err);
      })
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2 className="blueHeader">Sign Up</h2>
        <div>
          <label className="labelText" htmlFor="name">First Name</label>
          <input  id="firstname" type="name" size="40" name="firstname" value={firstName} onChange={firstNameChange} required />
        </div>
        <div>
          <label className="labelText" htmlFor="name">Last Name</label>
          <input id="lastname" type="name" size="40" name="lastname" value={lastName} onChange={lastNameChange} required />
        </div>
        <div>
          <label className="labelText" htmlFor="email">Email</label>
          <input id="email" type="email" size="40" name="email" onChange={emailChange} value={email} required />
        </div>
        <div>
        <PasswordWithRequirements resetVal={resetVal} isGoodPassword={setGoodPassword}/>
        </div>
        <p className="form-actions">
          <div className="button-container">
          <button className="centered-button" onClick={resetHandle} >
            Reset
          </button>
          <button type="submit" className="centered-button" disabled={!goodForm}>
            Sign Up
          </button>
          </div>
        </p>
      </form>
      
      {errmsg !== "" && (<ErrorBox errorMessage={errmsg} onClose={handleErrorClose} />)}
    </div>
  )
}

export default SignupWin;