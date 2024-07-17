import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'
import NotLoggedInError from "./NotLoggedInError";
import Categories from "../resources/Categories.js"

const Rule = () => {
    const navigate = useNavigate();
    const [rules, setRules] = React.useState([]);
    const [cats, setCats] = React.useState({});
    const ctx = React.useContext(MainContext);
    function fetchCategories() {
        console.log("fetchCategories");

        getJsonData("/api/v1/category/get_custom", {})
            .then((d) => {
                d.json()
                    .then((json) => {
                        if (json.status === "success") {
                            const cats = {};
                            cats.custom = json.data.custom;
                            cats.plaid = {};
                            for (const pr in Categories) {
                                // console.log(Categories[pr]);
                                cats.plaid[pr] = Categories[pr].map((l) => l[1]);
                            }
                            setCats(cats);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })

    }
    function refresh() {
        console.log("refresh")
        getJsonData("/api/v1/rule", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log("got rule json: ", json);
                        setRules(json.data)
                    })
            }).catch((err) => {
                // console.log("ERROR(rule)", err);
            })
        fetchCategories();
    }

    React.useEffect(() => {
        refresh();
    }, []);
    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Days</th>
                <th>Limit($)</th>
                <th>Category</th>
                <th>email</th>
                <th>Last Triggered</th>
            </tr>
        )
    }
    function addRule(event) {
        event.preventDefault();
        console.log('addRule');
        const dropdown = event.target.category;
        const selected = dropdown[dropdown.selectedIndex];
        console.log(selected.dataset.detailed);
        getJsonData("/api/v1/rule/create", {
            name: event.target.name.value,
            limit: event.target.limit.value,
            days: event.target.days.value,
            category: selected.dataset.detailed,
            email: event.target.email.value
        }).then((r) => {
            r.json()
                .then((json) => { 
                    refresh();
                })
        }).catch((err) => {
            // console.log(err);
        })
    }
    const deleteRule = (event) => {
        console.log(event.target.parentNode.parentNode.dataset.name);
        getJsonData("/api/v1/rule/delete", {
            name: event.target.parentNode.parentNode.dataset.name
        }).then((r) => {
            // console.log(r);
            refresh();
        }).catch((err) => {
            // console.log(err);
        })
    }
    const DrawTable = (({ rules }) => {
        if (rules.length == 0) return (<></>)
        return (
            <div>
                <hr className="table-divideLine" />
                <table className="table-general">
                    {drawHeader()}
                    {rules.map((r) => {
                        return <tr data-name={r.name} className="table-tdOdd">
                            <td>{r.name}</td>
                            <td>{r.days}</td>
                            <td>{r.limit}</td>
                            <td>{r.category}</td>
                            <td>{r.email}</td>
                            <td>{r.last_triggered}</td>
                        </tr>
                    })}
                </table>
            </div>
        )
    })
    const drawDropdown = () => {
        console.log('drawdropdown');
        if (Object.keys(cats).length === 0) {
            console.log('no category');
            return;
        }
        return <div>
            <label className="labelText" for="category">Type: </label>
            <select id="category">
                <option>ANY</option>
                <optgroup label="CUSTOM">
                    {cats.custom.map((cat) => {
                        return <option data-primary="CUSTOM" data-detailed={cat} value={cat}>{cat}</option>
                    })}
                </optgroup>
                {Object.entries(cats.plaid).map(([k, v]) => {
                    return <optgroup label={k}>
                        {v.map((cat) => {
                            // console.log(cat);
                            return <option data-primary={k} data-detailed={cat} value={cat}>{cat.split(k + "_")[1]}</option>
                        })}
                    </optgroup>
                })}

            </select>
        </div>
    }
    //<DrawTable t={trans}/>
    if (ctx.active === "0")
        return (
            <NotLoggedInError />
        )
    //fetchCategories();
    console.log('after fetch');
    console.log(cats);
    
    return (
        
        <div>
            <h2 className="blueHeader">Spending Alert Rule Setup</h2>
            <p className="leftAlignedText">
                To create a spending alert rule, you need to define three variables: Duration, Limit, and Email.
                This rule will help you monitor your spending and ensure that you're alerted when your total spending
                exceeds a predefined threshold (limit) within a specific time frame(Duration). The alert will be sent to
                the email specified and can also be viewed in the Alerts page.
            </p>
            <form onSubmit={addRule}>
                <div>
                    <label className="labelText" htmlFor="name">Name:</label>
                    <input id="name" name="name" />
                </div>
                <div>
                    <label className="labelText" htmlFor="limit">Maximum Amount limit($):</label>
                    <input id="limit" name="limit" />
                </div>
                <div>
                    <label className="labelText" htmlFor="days">Duration(Days):</label>
                    <input id="days" name="days" />
                </div>
                {drawDropdown()}

                <div>
                    <label className="labelText" htmlFor="email">Alert Email:</label>
                    <input id="email" name="email" />
                </div>
                <div className="button-container">
                    <button className="centered-button">Create</button>
                    <button type="reset" className="centered-button">Reset</button>
                </div>
            </form>
            <DrawTable rules={rules} />
        
        </div>

    )
}

export default Rule