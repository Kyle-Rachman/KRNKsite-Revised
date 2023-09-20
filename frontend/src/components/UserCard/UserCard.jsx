import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import InterestList from "../InterestList";
import AuthContext from "../Context/AuthContext";
import styles from "./UserCard.module.css";
import {Button, TextField } from "@mui/material";

const UserCard = (props) => {
    const { id } = useParams();
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [user, setUser] = useState({
        id: id,
        first_name: "",
        last_name: "",
        email: "",
        topics: [],
        created_at: new Date().toDateString(),
    });

    const [currentPassword, setCurrentPassword] = useState(""); // State for current password
    const [editedEmail, setEditedEmail] = useState(""); // State for edited email
    const [editedPassword, setEditedPassword] = useState(""); // State for edited password

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get("http://localhost:8000/api/user/" + id);
            const data = await res.data;
            data.created_at = new Date(data.created_at).toLocaleDateString();
            setUser(data);
        };
        fetchUser().catch((err) => console.log(err));
    }, []);

    const updateUser = async () => {
        try {
            // Send a PATCH request to update the user's information
            await axios.patch(`http://localhost:8000/api/user/${id}/update`, {
                email: editedEmail, // Add the email field for email updates
                current_password: currentPassword,  // Add the current password field for password updates
                password: editedPassword, // Add the password field for password updates
            });
            // Update the user state with the new email
            setUser({ ...user, email: editedEmail });
            setCurrentPassword("");
            setEditedEmail("");
            setEditedPassword("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.content}>
                <h1>{user.first_name + " " + user.last_name}</h1>
                <p>Member since: {user.created_at}</p>

                {/* Display the current email */}
                <p>Email: {user.email}</p>
                <div className={styles.info}>

                    {/* Input field to edit email */}
                    {
                        (currentUser.id == user.id) && <>
                            <div className={styles.form}>
                                <h3>Update User Info</h3>
                                <TextField
                                    label="Edit Email"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    variant="outlined"
                                    style={{marginBottom: "20px"}}
                                />

                                <TextField
                                    label="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    variant="outlined"
                                    type="password"
                                    style={{marginBottom: "20px"}}
                                />
                                {/* Input field to edit password */}
                                <TextField
                                    label="Edit Password"
                                    value={editedPassword}
                                    onChange={(e) => setEditedPassword(e.target.value)}
                                    variant="outlined"
                                    type="password"
                                    style={{marginBottom: "20px"}}
                                />
                                {/* Button to update user information */}
                                <Button onClick={updateUser} variant="contained" color="primary">
                                    Update
                                </Button>
                            </div>
                        </>
                    }
                    <div>
                        <h3>User Interests</h3>
                        <InterestList id={currentUser.id || id}></InterestList>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserCard;
