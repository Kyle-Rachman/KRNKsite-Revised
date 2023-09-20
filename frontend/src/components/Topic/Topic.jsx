import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { useParams, Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./Topic.module.css";

const Topic = (props) => {
    const { id } = useParams();
    const [papers, setPapers] = useState([]);
    const [topic, setTopic] = useState({ name: "" }); // Initialize with an empty name

    useEffect(() => {
        // Fetch the topic's name
        axios.get(`http://localhost:8000/api/topic/${id}`/*, { withCredentials: true }*/)
            .then((res) => {
                setTopic({ name: res.data.name });
            })
            .catch((err) => console.log(err));

        // Fetch papers for the topic
        axios.get(`http://localhost:8000/api/papers-by-topic/${id}`)
            .then((res) => {
                setPapers(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <>
            <Navbar />
            <div className={styles.content}>
                <h1>Articles on {topic.name}</h1>
                {papers.map((paper, idx) => {
                    return (
                        <div key={idx}>
                            <h3>{paper.title}</h3>
                            <Button variant="outlined" component={Link} to={paper.pdf_url}>See the Paper!</Button>
                            <br /> <br />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Topic;
