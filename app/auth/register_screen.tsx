import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	Easing,
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../../config/firebaseConfig';

const RegisterScreen = () => {
	const insets = useSafeAreaInsets();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [usernameFocused, setUsernameFocused] = useState(false);
	const [emailFocused, setEmailFocused] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
	const [isRegistering, setIsRegistering] = useState(false);
	const [emailValid, setEmailValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	// Simplified Animation values
	const opacity = useSharedValue(0);
	const usernameScale = useSharedValue(1);
	const emailScale = useSharedValue(1);
	const passwordScale = useSharedValue(1);
	const confirmPasswordScale = useSharedValue(1);
	const buttonScale = useSharedValue(1);
	const loadingRotation = useSharedValue(0);

	// Border animation values
	const usernameBorderWidth = useSharedValue(1);
	const emailBorderWidth = useSharedValue(1);
	const passwordBorderWidth = useSharedValue(1);
	const confirmPasswordBorderWidth = useSharedValue(1);

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 600 });
	}, []);

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		return password.length >= 8;
	};

	const handleUsernameChange = (text: string) => {
		setUsername(text);
	};

	const handleEmailChange = (text: string) => {
		setEmail(text);
		const isValid = text === '' || validateEmail(text);
		setEmailValid(isValid);
		emailBorderWidth.value = withSpring(isValid ? 1 : 2, { damping: 15 });
	};

	const handlePasswordChange = (text: string) => {
		setPassword(text);
		const isValid = text === '' || validatePassword(text);
		setPasswordValid(isValid);
		passwordBorderWidth.value = withSpring(isValid ? 1 : 2, { damping: 15 });

		if (confirmPassword !== '') {
			const match = text === confirmPassword;
			setPasswordsMatch(match);
			confirmPasswordBorderWidth.value = withSpring(match ? 1 : 2, { damping: 15 });
		}
	};

	const handleConfirmPasswordChange = (text: string) => {
		setConfirmPassword(text);
		const match = text === '' || text === password;
		setPasswordsMatch(match);
		confirmPasswordBorderWidth.value = withSpring(match ? 1 : 2, { damping: 15 });
	};

	const handleInputFocus = (inputType: string) => {
		const scaleValue =
			inputType === 'username'
				? usernameScale
				: inputType === 'email'
					? emailScale
					: inputType === 'password'
						? passwordScale
						: confirmPasswordScale;

		const borderValue =
			inputType === 'username'
				? usernameBorderWidth
				: inputType === 'email'
					? emailBorderWidth
					: inputType === 'password'
						? passwordBorderWidth
						: confirmPasswordBorderWidth;

		scaleValue.value = withSpring(1.02, { damping: 12, stiffness: 200 });
		borderValue.value = withSpring(2, { damping: 15 });
		runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

		if (inputType === 'username') setUsernameFocused(true);
		else if (inputType === 'email') setEmailFocused(true);
		else if (inputType === 'password') setPasswordFocused(true);
		else if (inputType === 'confirmPassword') setConfirmPasswordFocused(true);
	};

	const handleInputBlur = (inputType: string) => {
		const scaleValue =
			inputType === 'username'
				? usernameScale
				: inputType === 'email'
					? emailScale
					: inputType === 'password'
						? passwordScale
						: confirmPasswordScale;

		const borderValue =
			inputType === 'username'
				? usernameBorderWidth
				: inputType === 'email'
					? emailBorderWidth
					: inputType === 'password'
						? passwordBorderWidth
						: confirmPasswordBorderWidth;

		scaleValue.value = withSpring(1, { damping: 15 });
		borderValue.value = withSpring(1, { damping: 15 });

		if (inputType === 'username') setUsernameFocused(false);
		else if (inputType === 'email') setEmailFocused(false);
		else if (inputType === 'password') setPasswordFocused(false);
		else if (inputType === 'confirmPassword') setConfirmPasswordFocused(false);
	};

	const handleRegister = () => {
		if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
			const shakeAnimation = withSequence(
				withTiming(1.03, { duration: 80 }),
				withTiming(0.97, { duration: 80 }),
				withTiming(1.03, { duration: 80 }),
				withTiming(1, { duration: 80 })
			);
			usernameScale.value = shakeAnimation;
			emailScale.value = shakeAnimation;
			passwordScale.value = shakeAnimation;
			confirmPasswordScale.value = shakeAnimation;
			Alert.alert('Required Fields', 'Please fill in all fields');
			runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			return;
		}

		if (!validateEmail(email)) {
			emailScale.value = withSequence(
				withTiming(1.05, { duration: 100 }),
				withTiming(0.95, { duration: 100 }),
				withTiming(1, { duration: 100 })
			);
			Alert.alert('Invalid Email', 'Please enter a valid email address');
			runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			return;
		}

		if (!validatePassword(password)) {
			passwordScale.value = withSequence(
				withTiming(1.05, { duration: 100 }),
				withTiming(0.95, { duration: 100 }),
				withTiming(1, { duration: 100 })
			);
			Alert.alert('Password Requirements', 'Password must be at least 8 characters long');
			runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			return;
		}

		if (password !== confirmPassword) {
			passwordScale.value = withSequence(
				withTiming(1.05, { duration: 100 }),
				withTiming(0.95, { duration: 100 }),
				withTiming(1, { duration: 100 })
			);
			confirmPasswordScale.value = withSequence(
				withTiming(1.05, { duration: 100 }),
				withTiming(0.95, { duration: 100 }),
				withTiming(1, { duration: 100 })
			);
			Alert.alert('Password Mismatch', 'Passwords do not match');
			runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			return;
		}

		setIsRegistering(true);
		buttonScale.value = withSpring(0.96, { damping: 15 });

		loadingRotation.value = withRepeat(
			withTiming(360, {
				duration: 1200,
				easing: Easing.linear,
			}),
			-1,
			false
		);

		runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				updateProfile(user, { displayName: username })
					.then(() => {
						console.log('User registered and profile updated:', user);
						runOnJS(Haptics.notificationAsync)(
							Haptics.NotificationFeedbackType.Success
						);

						buttonScale.value = withSequence(
							withTiming(1.08, { duration: 150 }),
							withTiming(1, { duration: 150 })
						);

						router.replace('/auth/login_screen');
					})
					.catch((error) => {
						console.error('Error updating profile:', error);
						Alert.alert('Profile Update Error', error.message);
						runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
					});
			})
			.catch((error) => {
				console.error('Registration Error:', error);

				buttonScale.value = withSequence(
					withTiming(1.05, { duration: 100 }),
					withTiming(0.95, { duration: 100 }),
					withTiming(1.05, { duration: 100 }),
					withTiming(1, { duration: 100 })
				);

				let errorTitle = 'Registration Failed';
				let errorMessage = 'Unable to create your account';

				switch (error.code) {
					case 'auth/email-already-in-use':
						errorTitle = 'Email Already Registered';
						errorMessage = 'An account with this email already exists.';
						break;
					case 'auth/weak-password':
						errorTitle = 'Weak Password';
						errorMessage = 'Please choose a stronger password.';
						break;
					case 'auth/network-request-failed':
						errorTitle = 'Network Error';
						errorMessage = 'Please check your internet connection and try again.';
						break;
					default:
						errorMessage = error.message || 'Registration failed. Please try again.';
				}

				Alert.alert(errorTitle, errorMessage);
				runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			})
			.finally(() => {
				setIsRegistering(false);
				buttonScale.value = withSpring(1, { damping: 15 });
				loadingRotation.value = 0;
			});
	};

	// Animated styles
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const usernameAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: usernameScale.value }],
	}));

	const usernameBorderAnimatedStyle = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			usernameBorderWidth.value,
			[1, 2],
			['#E2E8F0', usernameFocused ? '#4c669f' : '#4c669f']
		);

		return {
			borderWidth: usernameBorderWidth.value,
			borderColor,
		};
	});

	const emailAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: emailScale.value }],
	}));

	const emailBorderAnimatedStyle = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			emailBorderWidth.value,
			[1, 2],
			[
				emailValid ? '#E2E8F0' : '#FCA5A5',
				emailFocused ? '#4c669f' : emailValid ? '#4c669f' : '#EF4444',
			]
		);

		return {
			borderWidth: emailBorderWidth.value,
			borderColor,
		};
	});

	const passwordAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: passwordScale.value }],
	}));

	const passwordBorderAnimatedStyle = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			passwordBorderWidth.value,
			[1, 2],
			[
				passwordValid ? '#E2E8F0' : '#FCA5A5',
				passwordFocused ? '#4c669f' : passwordValid ? '#4c669f' : '#EF4444',
			]
		);

		return {
			borderWidth: passwordBorderWidth.value,
			borderColor,
		};
	});

	const confirmPasswordAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: confirmPasswordScale.value }],
	}));

	const confirmPasswordBorderAnimatedStyle = useAnimatedStyle(() => {
		const borderColor = interpolateColor(
			confirmPasswordBorderWidth.value,
			[1, 2],
			[
				passwordsMatch ? '#E2E8F0' : '#FCA5A5',
				confirmPasswordFocused ? '#4c669f' : passwordsMatch ? '#4c669f' : '#EF4444',
			]
		);

		return {
			borderWidth: confirmPasswordBorderWidth.value,
			borderColor,
		};
	});

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: buttonScale.value }],
	}));

	const loadingAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${loadingRotation.value}deg` }],
	}));

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

			<SafeAreaView style={styles.safeArea}>
				<KeyboardAvoidingView
					style={styles.keyboardContainer}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				>
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={[
							styles.scrollContent,
							{
								paddingTop: 20,
								paddingBottom: Math.max(insets.bottom + 20, 40),
							},
						]}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps="handled"
					>
						<Animated.View style={[styles.content, containerAnimatedStyle]}>
							{/* Header */}
							<View style={styles.header}>
								<Image
									source={require('../../assets/images/image.png')}
									style={styles.logo}
									resizeMode="contain"
								/>
								<Text style={styles.tagline}>Advanced Bioanalytical Platform</Text>
								<View style={styles.securityBadge}>
									<Feather name="user-plus" size={14} color="#4c669f" />
									<Text style={styles.securityText}>Create Account</Text>
								</View>
							</View>

							{/* Form */}
							<View style={styles.formContainer}>
								<View style={styles.formHeader}>
									<Text style={styles.formTitle}>Join Nanospeed</Text>
									<Text style={styles.formSubtitle}>
										Create your account to get started
									</Text>
								</View>

								{/* Username Input */}
								<Animated.View
									style={[styles.inputContainer, usernameAnimatedStyle]}
								>
									<View style={styles.inputLabelContainer}>
										<Text style={styles.inputLabel}>Full Name</Text>
										{username !== '' && username.trim().length > 0 && (
											<Feather
												name="check-circle"
												size={14}
												color="#10B981"
											/>
										)}
									</View>
									<Animated.View
										style={[styles.inputWrapper, usernameBorderAnimatedStyle]}
									>
										<Feather
											name="user"
											size={18}
											color={usernameFocused ? '#4c669f' : '#94A3B8'}
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Enter your full name"
											placeholderTextColor="#94A3B8"
											value={username}
											onChangeText={handleUsernameChange}
											onFocus={() => handleInputFocus('username')}
											onBlur={() => handleInputBlur('username')}
											editable={!isRegistering}
										/>
										{username !== '' && username.trim().length > 0 && (
											<Feather name="check" size={18} color="#10B981" />
										)}
									</Animated.View>
								</Animated.View>

								{/* Email Input */}
								<Animated.View style={[styles.inputContainer, emailAnimatedStyle]}>
									<View style={styles.inputLabelContainer}>
										<Text style={styles.inputLabel}>Email Address</Text>
										{email !== '' && emailValid && (
											<Feather
												name="check-circle"
												size={14}
												color="#10B981"
											/>
										)}
									</View>
									<Animated.View
										style={[styles.inputWrapper, emailBorderAnimatedStyle]}
									>
										<Feather
											name="mail"
											size={18}
											color={emailFocused ? '#4c669f' : '#94A3B8'}
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Enter your email address"
											placeholderTextColor="#94A3B8"
											value={email}
											onChangeText={handleEmailChange}
											keyboardType="email-address"
											autoCapitalize="none"
											onFocus={() => handleInputFocus('email')}
											onBlur={() => handleInputBlur('email')}
											editable={!isRegistering}
										/>
										{email !== '' && (
											<Feather
												name={emailValid ? 'check' : 'alert-circle'}
												size={18}
												color={emailValid ? '#10B981' : '#EF4444'}
											/>
										)}
									</Animated.View>
									{!emailValid && email !== '' && (
										<Text style={styles.errorText}>
											Please enter a valid email address
										</Text>
									)}
								</Animated.View>

								{/* Password Input */}
								<Animated.View
									style={[styles.inputContainer, passwordAnimatedStyle]}
								>
									<View style={styles.inputLabelContainer}>
										<Text style={styles.inputLabel}>Password</Text>
										{password !== '' && passwordValid && (
											<Feather
												name="check-circle"
												size={14}
												color="#10B981"
											/>
										)}
									</View>
									<Animated.View
										style={[styles.inputWrapper, passwordBorderAnimatedStyle]}
									>
										<Feather
											name="lock"
											size={18}
											color={passwordFocused ? '#4c669f' : '#94A3B8'}
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Create a secure password"
											placeholderTextColor="#94A3B8"
											value={password}
											onChangeText={handlePasswordChange}
											secureTextEntry={!showPassword}
											onFocus={() => handleInputFocus('password')}
											onBlur={() => handleInputBlur('password')}
											editable={!isRegistering}
										/>
										<TouchableOpacity
											onPress={() => {
												setShowPassword(!showPassword);
												runOnJS(Haptics.impactAsync)(
													Haptics.ImpactFeedbackStyle.Light
												);
											}}
											style={styles.eyeButton}
										>
											<Feather
												name={showPassword ? 'eye-off' : 'eye'}
												size={18}
												color="#94A3B8"
											/>
										</TouchableOpacity>
									</Animated.View>
									{!passwordValid && password !== '' && (
										<Text style={styles.errorText}>
											Password must be at least 8 characters
										</Text>
									)}
								</Animated.View>

								{/* Confirm Password Input */}
								<Animated.View
									style={[styles.inputContainer, confirmPasswordAnimatedStyle]}
								>
									<View style={styles.inputLabelContainer}>
										<Text style={styles.inputLabel}>Confirm Password</Text>
										{confirmPassword !== '' && passwordsMatch && (
											<Feather
												name="check-circle"
												size={14}
												color="#10B981"
											/>
										)}
									</View>
									<Animated.View
										style={[
											styles.inputWrapper,
											confirmPasswordBorderAnimatedStyle,
										]}
									>
										<Feather
											name="shield"
											size={18}
											color={confirmPasswordFocused ? '#4c669f' : '#94A3B8'}
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Confirm your password"
											placeholderTextColor="#94A3B8"
											value={confirmPassword}
											onChangeText={handleConfirmPasswordChange}
											secureTextEntry={!showConfirmPassword}
											onFocus={() => handleInputFocus('confirmPassword')}
											onBlur={() => handleInputBlur('confirmPassword')}
											editable={!isRegistering}
										/>
										<TouchableOpacity
											onPress={() => {
												setShowConfirmPassword(!showConfirmPassword);
												runOnJS(Haptics.impactAsync)(
													Haptics.ImpactFeedbackStyle.Light
												);
											}}
											style={styles.eyeButton}
										>
											<Feather
												name={showConfirmPassword ? 'eye-off' : 'eye'}
												size={18}
												color="#94A3B8"
											/>
										</TouchableOpacity>
									</Animated.View>
									{!passwordsMatch && confirmPassword !== '' && (
										<Text style={styles.errorText}>Passwords do not match</Text>
									)}
								</Animated.View>

								{/* Register Button */}
								<Animated.View
									style={[styles.buttonContainer, buttonAnimatedStyle]}
								>
									<TouchableOpacity
										style={[
											styles.registerButton,
											isRegistering && styles.registerButtonDisabled,
										]}
										onPress={handleRegister}
										disabled={isRegistering}
										activeOpacity={0.95}
									>
										{isRegistering ? (
											<View style={styles.buttonContent}>
												<Animated.View style={loadingAnimatedStyle}>
													<Feather
														name="loader"
														size={20}
														color="#ffffff"
													/>
												</Animated.View>
												<Text style={styles.registerButtonText}>
													Creating Account...
												</Text>
											</View>
										) : (
											<View style={styles.buttonContent}>
												<Feather
													name="user-plus"
													size={18}
													color="#ffffff"
												/>
												<Text style={styles.registerButtonText}>
													Create Account
												</Text>
											</View>
										)}
									</TouchableOpacity>
								</Animated.View>

								{/* Login Link */}
								<View style={styles.loginSection}>
									<Text style={styles.loginText}>Already have an account? </Text>
									<TouchableOpacity
										onPress={() => {
											router.replace('/auth/login_screen');
											runOnJS(Haptics.impactAsync)(
												Haptics.ImpactFeedbackStyle.Light
											);
										}}
										disabled={isRegistering}
									>
										<Text style={styles.loginLink}>Sign In</Text>
									</TouchableOpacity>
								</View>
							</View>
						</Animated.View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	safeArea: {
		flex: 1,
	},
	keyboardContainer: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		paddingHorizontal: 24,
	},
	header: {
		alignItems: 'center',
		marginBottom: 40,
	},
	logo: {
		height: 75,
		width: 230,
		marginBottom: 16,
	},
	tagline: {
		fontSize: 16,
		color: '#64748B',
		fontWeight: '500',
		textAlign: 'center',
		marginBottom: 20,
		letterSpacing: 0.2,
	},
	securityBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F8FAFC',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	securityText: {
		fontSize: 13,
		color: '#4c669f',
		fontWeight: '600',
		marginLeft: 6,
	},
	formContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 28,
		padding: 32,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 10,
		borderWidth: 1,
		borderColor: '#F1F5F9',
	},
	formHeader: {
		marginBottom: 32,
	},
	formTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: '#1E293B',
		textAlign: 'center',
		marginBottom: 8,
		letterSpacing: -0.5,
	},
	formSubtitle: {
		fontSize: 16,
		color: '#64748B',
		textAlign: 'center',
		fontWeight: '400',
		letterSpacing: 0.1,
	},
	inputContainer: {
		marginBottom: 24,
	},
	inputLabelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
		letterSpacing: 0.1,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 56,
		borderRadius: 16,
		paddingHorizontal: 16,
		backgroundColor: '#FAFAFA',
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#1F2937',
		fontWeight: '500',
		letterSpacing: 0.2,
	},
	eyeButton: {
		padding: 4,
	},
	errorText: {
		fontSize: 12,
		color: '#EF4444',
		marginTop: 4,
		marginLeft: 4,
		fontWeight: '500',
	},
	buttonContainer: {
		marginTop: 8,
		marginBottom: 24,
	},
	registerButton: {
		height: 56,
		backgroundColor: '#4c669f',
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#4c669f',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 6,
	},
	registerButtonDisabled: {
		backgroundColor: '#94A3B8',
		shadowOpacity: 0.1,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	registerButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
		letterSpacing: 0.3,
	},
	loginSection: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loginText: {
		fontSize: 14,
		color: '#64748B',
		fontWeight: '400',
	},
	loginLink: {
		fontSize: 14,
		color: '#4c669f',
		fontWeight: '600',
		letterSpacing: 0.1,
	},
});

export default RegisterScreen;
