import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'
import '../css/styles.css';
import ErrorBoxWithLink from "./ErrorBoxWithLink";

const Transaction = () => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState([]);
    const ctx = React.useContext(MainContext)
    const [end, setEnd] = React.useState(new Date().toISOString().split('T')[0]);
    const [start, setStart] = React.useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0])
    const [cats, setCats] = React.useState({});
    const [total, setTotal] = React.useState(0);
    const styles = {
        divideLine : {
            width: '100%',            
            height: '2px',           
            border: 'none',          
        },
        table : {
            width: '100%',
            margin: '20px 20px',
        },
        th: {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'center',
            backgroundColor: '#f2f2f2',
        },
        tdOdd: {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'center',
            backgroundColor: '#ffffff'
        },
        tdEven : {
            border: '1px solid black',
            padding: '8px',
            textAlign: 'center',
            backgroundColor: '#f2f2f2'
        }

    };

    React.useEffect(() => {
        getJsonData("/api/v1/category/get", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log(json);
                        // console.log("got merchant json: ", json);
                        // console.log(json.data)
                        if (json.status === "success") {
                            setCats(json.data);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })
    }, [])
    const drawDropdown = () => {
        if (Object.keys(cats).length === 0) {
            return;
        }
        return <div>
            <label className="labelText" for="select_category">Spending Category </label>
            <select id="select_category">
                <option>ANY</option>
                {Object.entries(cats.plaid).map(([k, v]) => {
                    return <optgroup label={k}>
                        {v.map((cat) => {
                            // console.log(cat);
                            return <option data-primary={k} data-detailed={cat} value={cat}>{cat.split(k + "_")[1]}</option>
                        })}
                    </optgroup>
                })}
                <optgroup label="CUSTOM">
                    {cats.custom.map((cat) => {
                        return <option data-primary="CUSTOM" data-detailed={cat} value={cat}>{cat}</option>
                    })}
                </optgroup>
            </select>
        </div>
    }
    const drawHeader = () => {
        return (
            <tr>
                <th style={styles.th}>Merchant</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount($)</th>
                <th style={styles.th}>Category</th>
            </tr>
        )
    }
    function getTransactions(event) {
        event.preventDefault();
        setStart(event.target.start.value);
        setEnd(event.target.end.value);
        const dropdown = event.target.select_category;
        const selected = dropdown[dropdown.selectedIndex];
        getJsonData("/api/v1/transaction", {
            start_date: event.target.start.value,
            end_date: event.target.end.value,
            category: selected.dataset.detailed
        }).then((d) => {
            d.json()
                .then((json) => {
                    if (json.status === "success") {
                        setTrans(json.data.transactions);
                        const sum = json.data.transactions.reduce((accumulator, currentValue) => {
                            return accumulator + currentValue.amount;
                        }, 0);
                        setTotal(sum);
                    } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                        localStorage.token = "";
                        ctx.setActive1("0");
                    }
                })
        }).catch((err) => {
            // console.log("ERROR(transaction)", err);
        })
    }
    const DrawTable = (({ tr }) => {
        if (!Array.isArray(tr)) return (<></>)
        return (
            <div>
                <h1 className="blueHeader">Spending Report</h1>
                <form onSubmit={getTransactions}>
                    <div>
                        <label className="labelText" htmlFor="start">start(required, YYYY-MM-DD)  </label>
                        <input id="start" name="start" defaultValue={start} />
                    </div>
                    <div>
                        <label className="labelText" htmlFor="end">end(required, YYYY-MM-DD)  </label>
                        <input id="end" name="end" defaultValue={end} />
                    </div>
                    
                    {drawDropdown()}
                    <div className="button-container">
                        <button className="centered-button">Get Transactions</button>
                    </div>
                </form>
                <hr style={styles.divideLine} />
                <h4 className="blueHeader">Total Amount: ${total}</h4>
                <table style={styles.table}>
                    <tbody>
                        {drawHeader()}
                        {tr.map((t, index) => {
                            // console.log(t.name, t.category);
                            return (
                                <tr style={index % 2 === 0 ? styles.tdEven : styles.tdOdd}>
                                    <td>
                                        {t.name}
                                    </td>
                                    <td>
                                        {t.date}
                                    </td>
                                    <td>
                                        {t.amount}
                                    </td>
                                    <td>
                                        {t.category.detailed}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    })
    //< t={trans}/>
    if (ctx.active === "0") {
        return (
            <ErrorBoxWithLink errorMessage='You are not signed in.' link='/login' linkText='Sign In' />
        )
    }
    
    return (
        <div>
            <DrawTable tr={trans} />
        </div>
    )
}

export default Transaction