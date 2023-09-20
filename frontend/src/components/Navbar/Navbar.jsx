import React, { useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './Navbar.module.css';
import AuthContext from '../Context/AuthContext';

const buttonStyle = {
	color: 'black',
	backgroundColor: 'whitesmoke',
	border: '1px solid black',
	marginTop: '5px',
	textShadow: 'none'
};

const Navbar = (props) => {
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const today = new Date().toLocaleDateString();
	const logoutUser = async (e) => {
		try {
			setCurrentUser({
				id: 0
			});
			const res = await axios.post(
				`http://localhost:8000/api/logout/${currentUser.id}`,
				{}, 
				{ withCredentials: true }
			);
			navigate("/");
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<>
			<div className={styles.header}>
				<div className={styles.info}>
					{!currentUser.id && <h3>"And that's the way it is"</h3>}
					<p>Today: {today}</p>
					{currentUser.id && <Button
						variant='outlined'
						component={Link}
						to={'/dashboard'}
						style={buttonStyle}
					>
						Daily Digest
					</Button>}
				</div>
				<div className={styles.title}>
					<h1 style={{ fontSize: '2.5rem' }}>KRNKsite</h1>
					<p style={{ fontStyle: 'italic' }}>with the news</p>
				</div>
				<div className={styles.menu}>
					{currentUser.id && <Accordion style={{ border: '1px solid black' }}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='account-content'
						>
							<h3>Account</h3>
						</AccordionSummary>
						<AccordionDetails>
							<div>
								<Button component={Link} to={'/interests'}>
									Interests
								</Button>
							</div>
							<div>
								<Button component={Link} to={'/user/' + currentUser.id}>
									Settings
								</Button>
							</div>
							<div>
								<Button
									onClick={logoutUser}
								>
									Logout
								</Button>
							</div>
						</AccordionDetails>
					</Accordion>}
					{!currentUser.id && <Button
						variant='outlined'
						component={Link}
						to={'/'}
						style={buttonStyle}
					>
						Return Home
					</Button>}
				</div>
			</div>
		</>
	);
};

export default Navbar;
