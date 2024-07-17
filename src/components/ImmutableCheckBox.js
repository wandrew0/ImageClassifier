import React from 'react';
const ImmutableCheckBox = (props) => {
    return (
        <div>
        <input type="checkbox" checked={props.checked} disabled />
            <label>{props.label}</label>
        </div>
    );
}
export default ImmutableCheckBox;