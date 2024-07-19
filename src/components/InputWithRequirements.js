import React, {useState} from 'react';
const InputWithRequirements = ({requirements}) => {
    return (
        <div className="indent4">
            {
                requirements.map((item) => (
                    <div>
                        <input type="checkbox" checked={item.checked} disabled/><label>{item.label}</label>
                    </div>))
            }
        </div>
    )
}


export default InputWithRequirements;