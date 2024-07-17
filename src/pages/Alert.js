import {
    jsonFetch,
    buildIpAddress,
    getJsonData
} from "../components/common";
import React from "react";
import MainContext from "./MainContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import NotLoggedInError from "./NotLoggedInError";


const Alert = ({ active }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [alerts, setAlerts] = React.useState([]);
    const [transactions, setTransactions] = React.useState([]);
    const [selectedRow, setSelectedRow] = React.useState(-1);
    const ctx = React.useContext(MainContext);
    const alertObj = { alertId: id};
    console.log("alertObj");
    console.log(JSON.stringify(alertObj));
    
    React.useEffect(() => {
        refresh();
    }, []);
    function refresh() {
        getJsonData("/api/v1/alert/get", id == null ? {} : alertObj)
            .then((d) => {
                d.json().then((json) => {
                    if (json.status === "success") {
                        setAlerts(json.data);
                    } else if (
                        json.message === "jwt malformed" ||
                        json.message === "user doesn't exist" ||
                        json.message === "not logged in"
                    ) {
                        localStorage.setItem("token", "");
                        ctx.setActive1("0");
                    }
                });
            })
            .catch((err) => {
                console.log("ERROR(categories)", err);
            });
        
    }

    function handleRowClick(idList) {
        //console.log(selectedRow);
        //console.log(idList);
        getJsonData("/api/v1/transaction/get_by_ids", {
            transaction_ids : idList
        }).then((d) => {
            d.json().then((json) => {
                if (json.status == "success") {
                    //console.log(json.data.transactions);
                    setTransactions(json.data.transactions);
                } else if (json.message === "jwt malformed" ||
                    json.message === "user doesn't exist" ||
                json.message === "not logged in") {
                    localStorage.setItem("token", "");
                    ctx.setActive1("0");
                }
            });
        })
        .catch((err) => {
            console.log("ERROR:", err);
        });
    }

    const drawTransactions = () => {
        if (transactions.length === 0) {
            console.log("length is 0")
            return;
        }
        return (
            <div>
            <hr className="table-divideLine" />
            <h4 className="blueHeader">Transaction Detils</h4>
            <table className="table-general">
                    <tbody>
                    <tr className="table-th">
                    <th>Merchant</th>
                    <th>Date</th>
                    <th>Amount($)</th>
                    </tr>
                        
                        {transactions.map((t, index) => {
                            return (
                                <tr className={index%2 === 0 ? "table-tdEven" : "table-tdOdd"}>
                                    <td>
                                        {t.name}
                                    </td>
                                    <td>
                                        {t.date}
                                    </td>
                                    <td>
                                        {t.amount}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )

    }

    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Limit($)</th>
                <th>Days</th>
                <th>Date Triggered</th>
                <th>Actual Spending Amount($)</th>
                <th>Actions</th>
            </tr>
        );
    };
    const DrawTable = ({ input }) => {
        if (input.length === 0 ) return (
            <p><strong>No Alerts.</strong></p>
        )
        return (
            <div>
                <table className="table-general">
                    <tbody>
                        {drawHeader()}
                        {input.map((t, index) => {
                            return (
                                <tr className={[index === selectedRow ? "table-tdEvenHighlighted" : "table-tdEven"]}>
                                    <td>{t.name}</td>
                                    <td>{t.category}</td>
                                    <td>{t.limit}</td>
                                    <td>{t.days}</td>
                                    <td>{t.trigger_date}</td>
                                    <td>{t.total}</td>
                                    <td><button onClick={() => {
                                        setSelectedRow(index);
                                        handleRowClick(t.trans);
                                    }}>Details</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };
    //<DrawTable t={trans}/>
    
    if (ctx.active === "0") return <NotLoggedInError />
    return (
        <div>
            <h2 className="blueHeader">Alerts</h2>
            <DrawTable input={alerts} />
            {drawTransactions()}
        </div>
        
    );
};

export default Alert;
