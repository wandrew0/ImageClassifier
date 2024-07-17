import React from "react";
const CheckBox = (props) => {
    const [isChecked, setIsChecked] = React.useState(false);
    const onToggle = props.onToggle;
    const name = props.name;
    const handleChange = () => {
        console.log('handleChange;');
        const newState = !isChecked;
        setIsChecked(newState);
        console.log(newState);
        console.log(name);
        onToggle(newState, name); // Call the passed in onToggle function with the new state
        setIsChecked(newState);
    };
    return (
        <div>
            <input type="checkbox" checked={isChecked} onChange={handleChange} />
            <span>{name}</span>
        </div>
    )


};
export default CheckBox