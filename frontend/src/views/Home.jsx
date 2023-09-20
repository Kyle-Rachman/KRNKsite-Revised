import React, { useContext, useState } from 'react';
import axios from 'axios';
import UserForm from '../components/UserForm/UserForm';
import Featured from '../components/Featured/Featured';
import styles from './Home.module.css';
import AuthContext from '../components/Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
    const {currentUser, setCurrentUser} = useContext(AuthContext);
    const [errors, setErrors] = useState({
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        passwordError: "",
        confirmError: "",
        loginError: ""
    });
    const [newUser, setNewUser] = useState(true);
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString();

    const registerUser = async (userParam) => {
        try {
            const res = await axios.post(
                'http://localhost:8000/api/register/',
                userParam,
                { withCredentials: true }
            );
            console.log(res)
            setCurrentUser({
                id: res.data.id
            })
            setErrors({
                firstNameError: "",
                lastNameError: "",
                emailError: "",
                passwordError: "",
                confirmError: "",
                loginError: ""
            });
            navigate("/dashboard")
        } catch (err) {
            console.log(err)
            if (err.response.data.detail == "Email already registered") {
                setErrors((prev) => ({ ...prev, emailError: "This email is already in the system!" }));
            } else {
                for (const error of err.response.data.detail) {
                    if (error.msg.includes("Password")) {
                        if (error.msg.includes("8")) {
                            setErrors((prev) => ({ ...prev, passwordError: "Password must be at least 8 characters long!" }));
                        } else if (error.msg.includes("1")) {
                            setErrors((prev) => ({ ...prev, passwordError: "Password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character." }));
                        } else {
                            setErrors((prev) => ({ ...prev, passwordError: "", confirmError: "Passwords do not match!" }));
                        }
                    }
                    if (error.msg.includes("email")) {
                        setErrors((prev) => ({ ...prev, emailError: "Invalid email address!" }));
                    }
                };
            };
        };
    };

    const loginUser = async (userParam) => {
        try {
            const res = await axios.post(
                'http://localhost:8000/api/login',
                userParam,
                { withCredentials: true }
            );
            if (res.status === 200) {
                // Redirect to the dashboard or perform other actions
                setCurrentUser({
                    id: res.data.id
                })
                navigate("/dashboard");
            } else {
                // Handle other possible responses (e.g., incorrect email or password)
                setErrors((prev) => ({ ...prev, loginError: "Invalid email or password." }));
            }
            setErrors({
                firstNameError: "",
                lastNameError: "",
                emailError: "",
                passwordError: "",
                confirmError: "",
                loginError: ""
            });
        } catch (err) {
            setErrors((prev) => ({ ...prev, loginError: "Invalid login attempt!" }));
        }
    };

    const toggleForm = () => {
        setNewUser((prev) => !prev);
        setErrors({
            firstNameError: "",
            lastNameError: "",
            emailError: "",
            passwordError: "",
            confirmError: "",
            loginError: ""
        })
    };
    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <img
                        src={'../src/assets/wireframe-globe.svg'}
                        alt='logo'
                        id={styles.logo}
                    />
                    <div className={styles.title}>
                        <h1 style={{ fontSize: '2.5rem' }}>KRNKsite</h1>
                        <p style={{ fontStyle: 'italic' }}>with the news</p>
                    </div>
                    <div className={styles.info}>
                        <h3>"And that's the way it is"</h3>
                        <p>Today: {today}</p>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.featured}>
                        <h1>Featured Articles</h1>
                        <Featured></Featured>
                    </div>
                    <div className={styles.forms}>
                        {newUser && (
                            <div
                                className={styles.userform}
                                id={styles.register}
                            >
                                <h1>Sign Up</h1>
                                <UserForm
                                    onSubmitProp={registerUser}
                                    type='register'
                                    errors={errors}
                                />
                            </div>
                        )}
                        {!newUser && (
                            <div className={styles.userform} id={styles.login}>
                                <h1>Login</h1>
                                <UserForm
                                    onSubmitProp={loginUser}
                                    type='login'
                                    errors={errors}
                                />
                            </div>
                        )}
                        <p className={styles.changeform} onClick={toggleForm}>
                            {!newUser
                                ? 'Need an account? Sign up!'
                                : 'Already have an account? Log in here'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
