import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Digest from '../components/Digest';
import InterestList from '../components/InterestList';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {

    return (
        <>
            <Navbar userId={0}></Navbar>
            <div className={styles.content}>
                <div className={styles.interests}>
                    <h1>Your Interests:</h1>
                    <Link style={{color: "black"}} to={"/interests"}>(Edit)</Link>
                    <InterestList></InterestList>
                </div>
                <div className={styles.digest}>
                    <Digest></Digest>
                </div>
            </div>
        </>
    )
}

export default Dashboard