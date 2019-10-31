import * as React from "react";


declare var window:{ev:any};

export const Test: React.FC = () => {

    const handleChange = (event: any) => {
        console.log(event.target);
        window.ev = {...event.target};
    };

    return (
        <div style={{ margin: '20px' }}>
            <span style={{ borderRadius: '5px', border: '1px solid black', backgroundColor: 'yellow', fontSize: '80%', padding: '3px', marginRight: '3px' }}>Almafa</span>
            <span style={{ borderRadius: '5px', border: '1px solid black', backgroundColor: 'red', fontSize: '80%', padding: '3px', marginRight: '3px'  }}>#korte</span>
            <input />
        </div>

    );

    /* return (
        <div style={{ border: '1px solid black' }} contentEditable={true} onInput={handleChange} onBlur={handleChange}>
                    elotte
                    <span style={{ backgroundColor: 'red' }}>Alma</span>
                    fa
        </div>
    );*/
};
