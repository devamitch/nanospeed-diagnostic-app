import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
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

const LoginScreen = () => {
	const insets = useSafeAreaInsets();
	const [loading, setLoading] = useState(true);
	const [loginLoading, setLoginLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailFocused, setEmailFocused] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [emailValid, setEmailValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);

	// Simplified Animation values
	const opacity = useSharedValue(0);
	const emailScale = useSharedValue(1);
	const passwordScale = useSharedValue(1);
	const buttonScale = useSharedValue(1);
	const loadingRotation = useSharedValue(0);

	// Border animation values
	const emailBorderWidth = useSharedValue(1);
	const passwordBorderWidth = useSharedValue(1);

	useEffect(() => {
		opacity.value = withTiming(1, { duration: 600 });

		if (auth) {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				setLoading(false);
				if (user) {
					router.replace('/camera');
				}
			});
			return unsubscribe;
		} else {
			console.error('Firebase auth is undefined');
			setLoading(false);
			return () => {};
		}
	}, []);

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		return password.length >= 8;
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
	};

	const handleEmailFocus = () => {
		setEmailFocused(true);
		emailScale.value = withSpring(1.02, { damping: 12, stiffness: 200 });
		emailBorderWidth.value = withSpring(2, { damping: 15 });
		runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
	};

	const handleEmailBlur = () => {
		setEmailFocused(false);
		emailScale.value = withSpring(1, { damping: 15 });
		emailBorderWidth.value = withSpring(1, { damping: 15 });
		setEmailValid(email === '' || validateEmail(email));
	};

	const handlePasswordFocus = () => {
		setPasswordFocused(true);
		passwordScale.value = withSpring(1.02, { damping: 12, stiffness: 200 });
		passwordBorderWidth.value = withSpring(2, { damping: 15 });
		runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
	};

	const handlePasswordBlur = () => {
		setPasswordFocused(false);
		passwordScale.value = withSpring(1, { damping: 15 });
		passwordBorderWidth.value = withSpring(1, { damping: 15 });
		setPasswordValid(password === '' || validatePassword(password));
	};

	const handleLogin = () => {
		if (!auth) {
			Alert.alert('Error', 'Authentication system is not initialized');
			return;
		}

		if (!email.trim() || !password.trim()) {
			const shakeAnimation = withSequence(
				withTiming(1.03, { duration: 80 }),
				withTiming(0.97, { duration: 80 }),
				withTiming(1.03, { duration: 80 }),
				withTiming(1, { duration: 80 })
			);
			emailScale.value = shakeAnimation;
			passwordScale.value = shakeAnimation;
			Alert.alert('Required Fields', 'Please enter your email and password');
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
			Alert.alert('Password Requirements', 'Password must be at least 8 characters');
			runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			return;
		}

		setLoginLoading(true);
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

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log('User authenticated:', userCredential.user);
				runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);

				buttonScale.value = withSequence(
					withTiming(1.08, { duration: 150 }),
					withTiming(1, { duration: 150 })
				);

				router.replace('/camera');
			})
			.catch((error) => {
				console.error('Authentication error:', error);

				let errorTitle = 'Authentication Failed';
				let errorMessage = 'Unable to verify your credentials';

				switch (error.code) {
					case 'auth/network-request-failed':
						errorTitle = 'Network Error';
						errorMessage = 'Please check your internet connection and try again.';
						break;
					case 'auth/user-not-found':
						errorTitle = 'Account Not Found';
						errorMessage = 'No account found with this email address.';
						break;
					case 'auth/wrong-password':
						errorTitle = 'Invalid Credentials';
						errorMessage = 'Incorrect password. Please try again.';
						break;
					case 'auth/invalid-email':
						errorTitle = 'Invalid Email';
						errorMessage = 'Please enter a valid email address.';
						break;
					case 'auth/too-many-requests':
						errorTitle = 'Too Many Attempts';
						errorMessage = 'Too many failed login attempts. Please try again later.';
						break;
					default:
						errorMessage = error.message || 'Authentication failed. Please try again.';
				}

				buttonScale.value = withSequence(
					withTiming(1.05, { duration: 100 }),
					withTiming(0.95, { duration: 100 }),
					withTiming(1.05, { duration: 100 }),
					withTiming(1, { duration: 100 })
				);

				Alert.alert(errorTitle, errorMessage);
				runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);
			})
			.finally(() => {
				setLoginLoading(false);
				buttonScale.value = withSpring(1, { damping: 15 });
				loadingRotation.value = 0;
			});
	};

	// Animated styles
	const containerAnimatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

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

	const buttonAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: buttonScale.value }],
	}));

	const loadingAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${loadingRotation.value}deg` }],
	}));

	if (loading) {
		return (
			<View style={styles.loadingScreen}>
				<StatusBar barStyle="light-content" backgroundColor="#4c669f" />
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={styles.loadingText}>Initializing...</Text>
			</View>
		);
	}

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
									<Feather name="shield" size={14} color="#4c669f" />
									<Text style={styles.securityText}>Secure Access</Text>
								</View>
							</View>

							{/* Form */}
							<View style={styles.formContainer}>
								<View style={styles.formHeader}>
									<Text style={styles.formTitle}>Welcome Back</Text>
									<Text style={styles.formSubtitle}>Sign in to your account</Text>
								</View>

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
											onFocus={handleEmailFocus}
											onBlur={handleEmailBlur}
											editable={!loginLoading}
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
											placeholder="Enter your password"
											placeholderTextColor="#94A3B8"
											value={password}
											onChangeText={handlePasswordChange}
											secureTextEntry={!showPassword}
											onFocus={handlePasswordFocus}
											onBlur={handlePasswordBlur}
											editable={!loginLoading}
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

								{/* Login Button */}
								<Animated.View
									style={[styles.buttonContainer, buttonAnimatedStyle]}
								>
									<TouchableOpacity
										style={[
											styles.loginButton,
											loginLoading && styles.loginButtonDisabled,
										]}
										onPress={handleLogin}
										disabled={loginLoading}
										activeOpacity={0.95}
									>
										{loginLoading ? (
											<View style={styles.buttonContent}>
												<Animated.View style={loadingAnimatedStyle}>
													<Feather
														name="loader"
														size={20}
														color="#ffffff"
													/>
												</Animated.View>
												<Text style={styles.loginButtonText}>
													Authenticating...
												</Text>
											</View>
										) : (
											<View style={styles.buttonContent}>
												<Feather
													name="arrow-right"
													size={18}
													color="#ffffff"
												/>
												<Text style={styles.loginButtonText}>Sign In</Text>
											</View>
										)}
									</TouchableOpacity>
								</Animated.View>

								{/* Register Link */}
								<View style={styles.registerSection}>
									<Text style={styles.registerText}>New to Nanospeed? </Text>
									<TouchableOpacity
										onPress={() => {
											router.replace('/auth/register_screen');
											runOnJS(Haptics.impactAsync)(
												Haptics.ImpactFeedbackStyle.Light
											);
										}}
										disabled={loginLoading}
									>
										<Text style={styles.registerLink}>Create Account</Text>
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
	loadingScreen: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#4c669f',
	},
	loadingText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '500',
		marginTop: 16,
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
	loginButton: {
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
	loginButtonDisabled: {
		backgroundColor: '#94A3B8',
		shadowOpacity: 0.1,
	},
	buttonContent: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	loginButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
		marginLeft: 8,
		letterSpacing: 0.3,
	},
	registerSection: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	registerText: {
		fontSize: 14,
		color: '#64748B',
		fontWeight: '400',
	},
	registerLink: {
		fontSize: 14,
		color: '#4c669f',
		fontWeight: '600',
		letterSpacing: 0.1,
	},
});

export default LoginScreen;
