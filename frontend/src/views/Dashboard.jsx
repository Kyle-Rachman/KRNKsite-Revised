import React, { useContext } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Digest from '../components/Digest';
import InterestList from '../components/InterestList/InterestList';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import AuthContext from '../components/Context/AuthContext';

const Dashboard = () => {
    const {currentUser, setCurrentUser} = useContext(AuthContext);

    return (
        <>
            <Navbar ></Navbar>
            <div className={styles.content}>
                <div className={styles.interests}>
                    <h1>Your Interests:</h1>
                    <Link style={{color: "black"}} to={"/interests"}>(Edit)</Link>
                    <InterestList id={currentUser.id}></InterestList>
                </div>
                <div className={styles.digest}>
                    <Digest></Digest>
                </div>
            </div>
        </>
    )
}

export default Dashboard