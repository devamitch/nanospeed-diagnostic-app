import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { Link, Redirect, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Dimensions,
	Image,
	ImageBackground,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCameraPermission } from 'react-native-vision-camera';

const Welcome: React.FC = () => {
	const [agreed, setAgreed] = useState(false);
	const { hasPermission, requestPermission } = useCameraPermission();
	const [permissionRequested, setPermissionRequested] = useState(false);
	const [loading, setLoading] = useState(true);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		const checkAgreement = async () => {
			// AsyncStorage.clear();
			const hasAgreed = await AsyncStorage.getItem('hasAgreed');
			if (hasAgreed === 'true') {
				setRedirect(true);
			}
			setLoading(false);
		};
		checkAgreement();
	}, []);

	const handleContinue = async () => {
		await AsyncStorage.setItem('hasAgreed', 'true');
		setAgreed(true);

		if (!hasPermission) {
			requestPermission();
			setPermissionRequested(true);
		} else {
			setPermissionRequested(false);
			router.push('/auth/login_screen');
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
				<ActivityIndicator size="large" color="#4c669f" />
			</View>
		);
	}

	if (redirect) {
		return <Redirect href="/auth/login_screen" />;
	}

	return (
		<ImageBackground
			source={require('../assets/images/gradient.png')}
			style={[styles.background, StyleSheet.absoluteFillObject]}
			resizeMode="cover"
			blurRadius={0}
			accessibilityIgnoresInvertColors={true}
			accessibilityElementsHidden={true}
			importantForAccessibility="no-hide-descendants"
			accessibilityLabel="Welcome Screen Background"
			accessibilityRole="image"
			accessibilityLiveRegion="polite"
			accessibilityHint="This is the welcome screen for the Nanospeed Assay AI app"
			accessibilityLabelledBy="welcome-screen-label"
			accessibilityElements={[
				{
					label: 'Welcome to Nanospeed Assay AI',
					role: 'header',
					hint: 'Empowering quantitative Assays using ML',
				},
			]}
			accessibilityActions={[
				{
					name: 'continue',
					label: 'Continue to the app',
				},
			]}
			onAccessibilityAction={() => {
				if (hasPermission) {
					router.push('/auth/login_screen');
				} else {
					requestPermission();
					setPermissionRequested(true);
				}
			}}
			accessibilityState={{ busy: loading }}
			accessibilityValue={{ text: 'Loading...' }}
		>
			<StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

			<SafeAreaView style={styles.safeArea}>
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					<View style={styles.contentWrapper}>
						{/* Hero Image */}
						<View style={styles.imageWrapper}>
							<Image
								source={require('../assets/images/sunset.png')}
								style={styles.heroImage}
								resizeMode="cover"
							/>
						</View>

						{/* Title Section */}
						<View style={styles.titleContainer}>
							<Text style={styles.wt}>Welcome to</Text>
							<Text style={styles.title}>Nanospeed Assay AI</Text>
							<Text style={styles.subtitle}>
								Empowering quantitative Assays using ML
							</Text>
						</View>

						{/* Card Section */}
						<View style={styles.card}>
							{/* Disclaimer */}
							<View style={styles.disclaimerContainer}>
								<Text style={styles.cardText}>
									This app is for testing purposes only, and should not be used
									for diagnostic or clinical purposes.
								</Text>
							</View>

							{/* Checkbox */}
							<View style={styles.checkboxContainer}>
								<Checkbox
									value={agreed}
									onValueChange={setAgreed}
									color="#4c669f"
									style={styles.checkbox}
								/>
								<Text style={styles.checkboxLabel}>
									By using the app, you are agreeing to the{' '}
									<Link style={styles.tos} href="/terms">
										Terms of Service
									</Link>
								</Text>
							</View>

							{/* Button */}
							<TouchableOpacity
								style={[styles.continueButton, !agreed && styles.buttonDisabled]}
								onPress={handleContinue}
								disabled={!agreed}
								activeOpacity={0.8}
							>
								<Text style={styles.buttonText}>Continue</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		</ImageBackground>
	);
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
	},
	container: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	contentWrapper: {
		width: '100%',
		maxWidth: 420,
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	imageWrapper: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 15,
		elevation: 10,
		marginBottom: 24,
		borderRadius: 30,
	},
	heroImage: {
		height: isSmallScreen ? 180 : 200,
		width: width * 0.75,
		maxWidth: 300,
		borderRadius: 30,
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 36,
	},
	wt: {
		fontSize: isSmallScreen ? 32 : 36,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#87ceeb',
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.3)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 3,
	},
	title: {
		fontSize: isSmallScreen ? 28 : 32,
		fontWeight: 'bold',
		marginBottom: 10,
		color: '#fff',
		textAlign: 'center',
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},
	subtitle: {
		fontSize: isSmallScreen ? 16 : 18,
		textAlign: 'center',
		color: '#e0e0e0',
		maxWidth: 320,
		lineHeight: 24,
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	card: {
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderRadius: 20,
		padding: 24,
		width: '100%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 20,
		elevation: 12,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.5)',
	},
	disclaimerContainer: {
		backgroundColor: 'rgba(255, 248, 225, 0.7)',
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
		borderLeftWidth: 3,
		borderLeftColor: '#ffc107',
	},
	cardText: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 4,
		color: '#333',
		lineHeight: 22,
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 24,
		paddingHorizontal: 4,
	},
	checkbox: {
		marginTop: 3,
		marginRight: 12,
		borderRadius: 4,
	},
	checkboxLabel: {
		flex: 1,
		fontSize: 16,
		color: '#333',
		lineHeight: 22,
	},
	continueButton: {
		backgroundColor: '#4c669f',
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 16,
		width: '100%',
		alignItems: 'center',
		shadowColor: '#4c669f',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	buttonDisabled: {
		backgroundColor: '#A0A0A0',
		shadowOpacity: 0.1,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	tos: {
		color: 'blue',
		textDecorationLine: 'underline',
	},
});

export default Welcome;
