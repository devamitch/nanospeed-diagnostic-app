import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { deleteAccount } from '../../authService';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccountScreen: React.FC = () => {
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleDeleteAccount = async () => {
		if (!password.trim()) {
			Alert.alert('Error', 'Please enter your password');
			return;
		}

		Alert.alert(
			'Confirm Account Deletion',
			'This action cannot be undone. All your data will be permanently deleted. Are you sure you want to continue?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete Account',
					style: 'destructive',
					onPress: async () => {
						setLoading(true);

						try {
							const result = await deleteAccount(password);
							setLoading(false);

							if (result.success) {
								Alert.alert(
									'Account Deleted',
									'Your account has been successfully deleted.',
									[
										{
											text: 'OK',
											onPress: () => router.push('/auth/login_screen'),
										},
									]
								);
							} else {
								Alert.alert('Error', result.message);
							}
						} catch (error) {
							setLoading(false);
							Alert.alert('Error', 'An unexpected error occurred. Please try again.');
						}
					},
				},
			]
		);
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
					<Text style={styles.headerTitle}>Delete Account</Text>
					<View style={styles.placeholder} />
				</View>

				<View style={styles.content}>
					<View style={styles.iconContainer}>
						<Ionicons name="warning-outline" size={60} color="#FF3B30" />
					</View>

					<Text style={styles.title}>Delete Account</Text>

					<View style={styles.warningContainer}>
						<Ionicons
							name="alert-circle"
							size={22}
							color="#FF3B30"
							style={styles.warningIcon}
						/>
						<Text style={styles.warning}>
							This action is permanent and cannot be undone
						</Text>
					</View>

					<Text style={styles.description}>
						For security reasons, please enter your password to confirm account
						deletion. All your data will be permanently removed from our servers.
					</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.inputLabel}>Password</Text>
						<View style={styles.inputWrapper}>
							<Ionicons
								name="lock-closed-outline"
								size={20}
								color="#999"
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.input}
								placeholder="Enter your password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={true}
								placeholderTextColor="#A0A0A0"
							/>
						</View>
					</View>

					<TouchableOpacity
						style={[styles.dangerButton, loading && styles.buttonDisabled]}
						onPress={handleDeleteAccount}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<>
								<Ionicons
									name="trash-outline"
									size={18}
									color="#FFFFFF"
									style={styles.buttonIcon}
								/>
								<Text style={styles.dangerButtonText}>Delete My Account</Text>
							</>
						)}
					</TouchableOpacity>

					<TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
						<Text style={styles.secondaryButtonText}>Cancel</Text>
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
	content: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
	},
	iconContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: 'rgba(255, 59, 48, 0.1)',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
		alignSelf: 'center',
		shadowColor: '#FF3B30',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 2,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333333',
		marginBottom: 24,
		textAlign: 'center',
	},
	warningContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFF5F5',
		padding: 16,
		borderRadius: 12,
		marginBottom: 24,
		borderWidth: 1,
		borderColor: '#FFDDDD',
	},
	warningIcon: {
		marginRight: 10,
	},
	warning: {
		fontSize: 16,
		color: '#FF3B30',
		fontWeight: '600',
		flex: 1,
	},
	description: {
		fontSize: 16,
		color: '#666666',
		marginBottom: 32,
		lineHeight: 24,
	},
	inputContainer: {
		marginBottom: 32,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#333333',
		marginBottom: 8,
		marginLeft: 4,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		borderRadius: 12,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: '#E0E0E0',
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
	dangerButton: {
		backgroundColor: '#FF3B30',
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		marginBottom: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		shadowColor: '#FF3B30',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonIcon: {
		marginRight: 8,
	},
	dangerButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		borderRadius: 12,
		padding: 16,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E0E0E0',
		backgroundColor: 'white',
	},
	secondaryButtonText: {
		color: '#4A90E2',
		fontSize: 16,
		fontWeight: '500',
	},
});

export default DeleteAccountScreen;
