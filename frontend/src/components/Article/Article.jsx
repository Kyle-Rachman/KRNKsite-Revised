import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import styles from './Article.module.css';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material';

const Article = (props) => {
    const { id } = useParams();
    const [paper, setPaper] = useState({});
    const [summary, setSummary] = useState({});

    useEffect(() => {
        // Fetch the paper data
        axios.get(`http://localhost:8000/api/paper/get/${id}`)
            .then(res => {
                setPaper(res.data);
            })
            .catch(err => console.log(err));
    }, [id]); // Include "id" as a dependency to re-fetch data when the ID changes

    return (
        <>
            <Navbar></Navbar>
            <div className={styles.content}>
                <h1 className={styles.title}>{paper.title}</h1>
                <hr />
                <p className={styles.summary}>{paper.summary}</p>
                <hr />
                <Button variant="outlined" component={Link} to={paper.pdf_url} style={{ color: "black", border: "1px solid black", margin: "20px 0px" }}>To Source</Button>
            </div>
        </>
    );
}

export default Article;
