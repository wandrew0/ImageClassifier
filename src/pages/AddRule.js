import React from "react";
import { jsonFetch, buildIpAddress } from "../components/common";
import { Link } from 'react-router-dom'

const AddRule = () => {

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const postdata = {
        name: data.name,
    }
    // console.log("data=", data, "post=", postdata);
    const filename = buildIpAddress(3000, "/api/v1/rule/add");
    //const filename = "http://127.0.0.1:3000/api/v1/customer"
    jsonFetch(filename, postdata)
    .then((d) => {
        // console.log("d=", d);
        d.json()
        .then((json) => {
            // console.log("got json: ", json);
        })
    }).catch((err) => {
        // console.log("ERROR(add rule)", err);
    })
  }
  return (
    <div>
        <form onSubmit={handleSubmit}>
          <h2>Add Rule</h2>
          <div>
            <label htmlFor="name">Store Name</label>
            <input id="name" type="name" name="name" required/>
          </div>
          <p className="form-actions">
            <button type="reset" className="button button-flat">
              Reset
            </button>
            <button type="submit" className="button">
              Add
            </button>
          </p>
        </form>
        <Link to="/Rule">Rule Page</Link>
    </div>
  )
}

export default AddRule;