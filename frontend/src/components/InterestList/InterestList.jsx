import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./InterestList.module.css";
import { Button } from '@mui/material';

const InterestList = (props) => {
    const {id} = props
    const [interests, setInterests] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8000/api/user-interests/' + id)
            .then(res => {
                setInterests(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <div className={styles.listStyle}>
            {interests.map((interest, idx) => {
                return (
                    <div key={idx}>
                        <Button variant='outlined' className={styles.buttonStyle} component={ Link } to={'/topic/' + interest.id}>
                            {interest.name}
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}

export default InterestList