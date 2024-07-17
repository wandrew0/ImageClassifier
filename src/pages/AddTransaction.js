import React from "react";
import { jsonFetch, buildIpAddress } from "../components/common";
import { Link } from 'react-router-dom'

const AddTransaction = () => {

  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());
    const postdata = {
        name: data.name,
        date: data.date,
        amount: data.amount,
        category: data.category
    }
    // console.log("data=", data, "post=", postdata);
    const filename = buildIpAddress(3000, "/api/v1/transaction/add");
    //const filename = "http://127.0.0.1:3000/api/v1/transaction/add"
    jsonFetch(filename, postdata)
    .then((d) => {
        // console.log("d=", d);
        d.json()
        .then((json) => {
            // console.log("got json: ", json);
        })
    }).catch((err) => {
        // console.log("ERROR(signup)", err);
    })
  }
  return (
    <div>
        <form onSubmit={handleSubmit}>
          <h2>Add Transaction</h2>
          <div>
            <label htmlFor="name">Store Name</label>
            <input id="name" type="name" name="name" required/>
          </div>
          <div>
            <label htmlFor="name">Date</label>
            <input id="date" type="date" name="date" required/>
          </div>
          <div>
            <label htmlFor="name">Amount</label>
            <input id="amount" type="amount" name="amount" />
          </div>
          <div>
            <label htmlFor="name">Category</label>
            <input id="category" type="category" name="category" />
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
        <Link to="/Transaction">Transaction</Link>
    </div>
  )
}

export default AddTransaction;