import React from "react";
import { Link } from 'react-router-dom'
import '../css/styles.css';

const BlueLink = (props) => {

    return (
        <Link className='blueText' to={props.to}>{props.text}</Link>
    )

}
export default BlueLink;