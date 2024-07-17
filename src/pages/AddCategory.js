import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { Link, useNavigate } from 'react-router-dom'
import NotLoggedInError from "./NotLoggedInError";

const Merchant = ({ active }) => {
    const [cats, setCats] = React.useState([]);
    const [selected, setSelected] = React.useState("");
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        refresh();
    }, []);
    function refresh() {
        getJsonData("/api/v1/category/get_custom", {})
            .then((d) => {
                d.json()
                    .then((json) => {
                        if (json.status === "success") {
                            setCats(json.data.custom);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })
    }
    function add_category(event) {
        event.preventDefault();
        if (event.target.name.value === "") {
            return;
        }
        console.log(event.target.name.value);
        getJsonData("/api/v1/category/create", {
            name: event.target.name.value
        }).then((d) => {
            d.json()
                .then((json) => {
                    if (json.status === "success") {
                    } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                        localStorage.setItem("token", "");
                        ctx.setActive1("0");
                    }
                    refresh();
                })
        }).catch((err) => {
            console.log("ERROR(categories)", err);
        })
    }
    const drawHeader = () => {
        return (
            <tr className="table-th">
                <th>Name</th>
            </tr>
        )
    }
    function change(event) {
        event.preventDefault();
        setSelected(event.target.value);
    }
    const DrawTable = (({ input }) => {
        if (input.length === 0) return (<></>)
        return (
            <div>
                <h4 className="blueHeader">Existing User-Defined Merchant Types</h4>
                <table className="table-general">
                    <tbody>
                        {drawHeader()}
                        {input.map((t, index) => {
                            return (
                                <tr className={index%2 ===0 ? "table-tdOdd" : "table-tdEven"}>
                                    <td>{t}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    })
    //<DrawTable t={trans}/>
    if (ctx.active === "0")
        return (
            <NotLoggedInError />
        )
    return (
        <div>
            <h2 className="blueHeader">User-Defined Merchant Types</h2>
            <form onSubmit={add_category}>
                <div>
                    <label className="labelText" htmlFor="name">New Merchant Type Name: </label>
                    <input className=""id="name" name="name" value={selected} onChange={change} />
                </div>
                <div className="button-container">
                <button className="centered-button">Add</button>
                </div>
            </form>
            <DrawTable input={cats} />
        </div>
    )
}

export default Merchant