import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { resetPassword } from '../../authService';
import { getAuth } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { logOutUser } from '../../authService';

const ResetPassword = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const auth = getAuth();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	useEffect(() => {
		if (auth.currentUser?.email) {
			setEmail(auth.currentUser.email);
		}
	}, []);

	const handleLogout = async () => {
		setIsLoggingOut(true);

		try {
			const result = await logOutUser();

			if (result.success) {
				router.replace('/auth/login_screen');
			} else {
				Alert.alert('Logout Failed', result.message);
			}
		} catch (error) {
			Alert.alert('Error', 'An unexpected error occurred. Please try again.');
			console.error('Logout error:', error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const handleResetPassword = async () => {
		if (!email.trim()) {
			Alert.alert('Error', 'Please enter your email address');
			return;
		}

		setLoading(true);

		try {
			// Pass auth as a parameter to resetPassword
			const result = await resetPassword(auth, email);
			setLoading(false);

			if (result.success) {
				Alert.alert(
					'Success',
					'Password reset instructions have been sent to your email.',
					[{ text: 'OK', onPress: () => handleLogout() }] // Fixed: Now actually calling the function
				);
			} else {
				Alert.alert('Error', result.message);
			}
		} catch (error) {
			setLoading(false);
			Alert.alert('Error', 'An unexpected error occurred. Please try again.');
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardAvoidingView}
			>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.back()}
						hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
					>
						<Ionicons name="chevron-back" size={24} color="#4A90E2" />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>Reset Password</Text>
					<View style={styles.placeholder} />
				</View>

				<View style={styles.contentContainer}>
					<View style={styles.iconContainer}>
						<Ionicons name="lock-open-outline" size={60} color="#4A90E2" />
					</View>

					<Text style={styles.title}>Forgot Password?</Text>
					<Text style={styles.description}>
						Enter your email address and we'll send you instructions to reset your
						password.
					</Text>

					<View style={styles.inputContainer}>
						<Ionicons
							name="mail-outline"
							size={20}
							color="#999"
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.input}
							placeholder="Email address"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							placeholderTextColor="#999"
						/>
					</View>

					<TouchableOpacity
						style={[styles.primaryButton, loading && styles.buttonDisabled]}
						onPress={handleResetPassword}
						disabled={loading}
						activeOpacity={0.8}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<>
								<Ionicons
									name="send-outline"
									size={18}
									color="#FFF"
									style={styles.buttonIcon}
								/>
								<Text style={styles.primaryButtonText}>Send Reset Link</Text>
							</>
						)}
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F8FA',
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333333',
	},
	backButton: {
		padding: 4,
	},
	placeholder: {
		width: 24,
	},
	contentContainer: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: 'rgba(74, 144, 226, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
		shadowColor: '#4A90E2',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		color: '#333333',
		textAlign: 'center',
	},
	description: {
		fontSize: 16,
		color: '#666666',
		marginBottom: 32,
		textAlign: 'center',
		lineHeight: 22,
		paddingHorizontal: 10,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		marginBottom: 24,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: '#E5E9F0',
		width: '100%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 3,
		elevation: 1,
	},
	inputIcon: {
		marginRight: 10,
	},
	input: {
		flex: 1,
		padding: 16,
		fontSize: 16,
		color: '#333',
	},
	primaryButton: {
		backgroundColor: '#4A90E2',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		marginBottom: 16,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		shadowColor: '#4A90E2',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 3,
	},
	buttonDisabled: {
		backgroundColor: '#A0C3E8',
	},
	buttonIcon: {
		marginRight: 8,
	},
	primaryButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		width: '100%',
		borderWidth: 1,
		borderColor: '#E5E9F0',
		backgroundColor: '#FFFFFF',
	},
	secondaryButtonText: {
		color: '#4A90E2',
		fontSize: 16,
		fontWeight: '500',
	},
});

export default ResetPassword;
