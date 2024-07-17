
/*async function textFetch(filename, data=undefined) {
    console.log("fetching text: ", filename);
    const d = await (data) ? fetch(filename, {
            method: "POST", body: data }) 
        : fetch(filename);
    if (d.status !== 200) return undefined;
    const text = await d.text();
    return(text);
}*/

function buildIpAddress(port, local_address) {
    const address = window.location.origin;
    console.log(address);
    let addr = address.replace("https", "http");
    const port_regex = /:[0-9]+$/;
    const port_index = addr.search(port_regex);
    let addr1;
    if (port_index > 0) addr1 = addr.substring(0, port_index);
    else addr1 = addr;
    if (port) addr1 += ":" + port;
    if (local_address) addr1 += local_address;
    console.log('addr=', addr, "port_i=", port_index, "addr1=", addr1);
    return (addr1);
}

async function getJsonData(local_address, body) {
    // console.log(body);
    const filename = buildIpAddress(3000, local_address);
    //const filename = "http://127.0.0.1:3000/api/v1/transaction"
    const d = await jsonFetch(filename, body, "Bearer " + localStorage.token)
    return d;
}
async function jsonFetch(filename, data = undefined, auth = undefined) {

    const headers = { "Content-type": "application/json; charset=UTF-8" };
    if (auth) headers["Authorization"] = auth;
    // console.log("fetching JSON: ", filename, headers);
    const d = await ((data) ? fetch(filename, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
        : fetch(filename, {
            method: "GET",
            headers: headers
        }));
    //const code = d.status / 100;
    //console.log("data=", d, "code=", code)
    //if (code !== 2) return undefined;
    //const json = await d.json();
    return (d);
}

const isActive = () => {
    return localStorage.getItem("active");
}

const setActive = (b) => {
    localStorage.setItem("active", b)
}
export default jsonFetch;
export { jsonFetch, buildIpAddress, getJsonData, isActive, setActive };