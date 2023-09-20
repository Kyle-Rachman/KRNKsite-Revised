import React from 'react';
import Featured from './Featured/Featured';

const Digest = (props) => {
    const today = new Date().toLocaleDateString();

    return (
        <>
            <h1>Daily Digest</h1>
            <p>{today}</p>
            <Featured></Featured>
        </>
    )
}

export default Digest