import React, { useState } from 'react';
import styles from './UserForm.module.css';
import {
	Button,
	FormControl,
	Input,
	InputLabel,
	InputAdornment
} from '@mui/material';

const UserForm = (props) => {
	const { onSubmitProp, type, errors } = props;
	const [user, setUser] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		confirm_password: ''
	});
	const [showPassword, setShowPassword] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmitProp(user);
		setUser({
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			confirm_password: ''
		});
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className={styles.container}>
					{type == 'register' ? (
						<>
							<FormControl>
								<InputLabel
									htmlFor={'first_name' + type}
									style={{ marginTop: '5px' }}
								>
									First Name:{' '}
								</InputLabel>
								<Input
									type='text'
									className={styles.field}
									id={'first_name' + type}
									value={user.first_name}
									onChange={(e) =>
										setUser((prev) => ({
											...prev,
											first_name: e.target.value
										}))
									}
								/>
							</FormControl>
							{
								errors.firstNameError ?
									<div className={styles.error}>
										<p>{errors.firstNameError}</p>
									</div> :
									""
							}
							<FormControl>
								<InputLabel
									htmlFor={'last_name' + type}
									style={{ marginTop: '5px' }}
								>
									Last Name:{' '}
								</InputLabel>
								<Input
									type='text'
									className={styles.field}
									id={'last_name' + type}
									value={user.last_name}
									onChange={(e) =>
										setUser((prev) => ({
											...prev,
											last_name: e.target.value
										}))
									}
								/>
								{
									errors.lastNameError ?
										<div className={styles.error}>
											<p>{errors.lastNameError}</p>
										</div> :
										""
								}
							</FormControl>
						</>
					) : (
						''
					)}
					<FormControl>
						<InputLabel
							htmlFor={'Email' + type}
							style={{ marginTop: '5px' }}
						>
							Email:{' '}
						</InputLabel>
						<Input
							type='email'
							className={styles.field}
							id={'Email' + type}
							value={user.email}
							onChange={(e) =>
								setUser((prev) => ({
									...prev,
									email: e.target.value
								}))
							}
						/>
					</FormControl>
					{
						(type == 'register' && errors.emailError) ?
							<div className={styles.error}>
								<p>{errors.emailError}</p>
							</div> :
							""
					}
					<FormControl>
						<InputLabel
							htmlFor={'password' + type}
							style={{ marginTop: '5px' }}
						>
							Password:{' '}
						</InputLabel>
						<Input
							type={showPassword ? 'text' : 'password'}
							className={styles.field}
							id={'password' + type}
							value={user.password}
							onChange={(e) =>
								setUser((prev) => ({
									...prev,
									password: e.target.value
								}))
							}
							endAdornment={
								<InputAdornment
									className={styles.eye}
									position='end'
								>
									<i
										className={
											showPassword
												? `far fa-eye-slash ${styles.eye}`
												: `far fa-eye ${styles.eye}`
										}
										id='toggleShowPassword'
										onClick={() =>
											setShowPassword((prev) => !prev)
										}
									></i>
								</InputAdornment>
							}
						/>
					</FormControl>
					{
						(type == 'register' && errors.passwordError) ?
							<div className={styles.error}>
								<p>{errors.passwordError}</p>
							</div> :
							""
					}
					{type == 'register' ? (
						<>
							<FormControl>
								<InputLabel
									htmlFor={'confirm_password' + type}
									style={{ marginTop: '5px' }}
								>
									Confirm Password:{' '}
								</InputLabel>
								<Input
									type={showPassword ? 'text' : 'password'}
									className={styles.field}
									id={'confirm_password' + type}
									value={user.confirm_password}
									onChange={(e) =>
										setUser((prev) => ({
											...prev,
											confirm_password: e.target.value
										}))
									}
								/>
							</FormControl>
							{
								errors.confirmError ?
									<div className={styles.error}>
										<p>{errors.confirmError}</p>
										<br />
									</div> :
									""
							}
						</>
					) : (
						''
					)}
				</div>
				{type == 'register' ? (
					<Button
						variant='outlined'
						type='submit'
						style={{ color: "whitesmoke", backgroundColor: "rgba(84, 136, 215, 0.6)", border: '1px solid black' }}
					>
						Sign Up
					</Button>
				) : (
					<>
						{
							errors.loginError ?
								<div className={styles.error}>
									<p>{errors.loginError}</p>
									<br />
								</div> :
								""
						}
						<Button
							variant='outlined'
							type='submit'
							style={{ color: "whitesmoke", backgroundColor: "rgba(58,94,70,0.6)", border: '1px solid black' }}
						>
							Log In
						</Button>
					</>
				)}
			</form>
		</>
	);
};

export default UserForm;
