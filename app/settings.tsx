import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Alert,
	ActivityIndicator,
	StatusBar,
	Platform,
	KeyboardAvoidingView,
	Linking, // Added Linking import
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { logOutUser } from '../authService';
import { getAuth } from 'firebase/auth';

const Settings: React.FC = () => {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [userData, setUserData] = useState({
		displayName: '',
		email: '',
	});
	const [isLoading, setIsLoading] = useState(true);

	// Helper function to open URLs
	const openURL = async (url: string) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			} else {
				Alert.alert('Error', 'Cannot open this URL');
			}
		} catch (error) {
			console.error('Error opening URL:', error);
		}
	};

	useEffect(() => {
		// Get current user data when component mounts
		const auth = getAuth();
		const user = auth.currentUser;

		if (user) {
			setUserData({
				displayName: user.displayName || 'User',
				email: user.email || 'No email provided',
			});
		} else {
			// If no user is logged in, redirect to login
			router.replace('/auth/login_screen');
		}

		setIsLoading(false);
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

	const confirmLogout = () => {
		Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{ text: 'Logout', onPress: handleLogout, style: 'destructive' },
		]);
	};

	const renderSettingItem = (
		icon: string,
		title: string,
		onPress?: () => void,
		showChevron: boolean = true,
		iconColor: string = '#4A90E2'
	) => (
		<TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
			<View style={[styles.iconWrapper, { backgroundColor: `${iconColor}15` }]}>
				<Ionicons name={icon as any} size={20} color={iconColor} />
			</View>
			<Text style={styles.settingText}>{title}</Text>
			{showChevron && <Ionicons name="chevron-forward" size={20} color="#BBBBBB" />}
		</TouchableOpacity>
	);

	if (isLoading) {
		return (
			<SafeAreaView style={[styles.container, styles.loadingContainer]}>
				<ActivityIndicator size="large" color="#4A90E2" />
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#F7F8FA" />
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
						<Ionicons name="chevron-back" size={24} color="#007AFF" />
					</TouchableOpacity>
					<Text style={styles.title}>Settings</Text>
					<View style={styles.placeholder} />
				</View>

				<ScrollView
					contentContainerStyle={styles.scrollContainer}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.profileSection}>
						<View style={styles.avatarContainer}>
							<Ionicons name="person" size={40} color="#FFFFFF" />
						</View>
						<View style={styles.profileInfo}>
							<Text style={styles.profileName}>{userData.displayName}</Text>
							<Text style={styles.profileEmail}>{userData.email}</Text>
						</View>
					</View>

					<Text style={styles.sectionTitle}>Legal</Text>
					<View style={styles.card}>
						{renderSettingItem('document-text-outline', 'Terms of Service', () =>
							router.push('/terms_of_service')
						)}
						{renderSettingItem('shield-outline', 'Privacy Policy', () =>
							router.push('/privacy_policy')
						)}
					</View>

					<Text style={styles.sectionTitle}>Support</Text>
					<View style={styles.card}>
						{renderSettingItem('lock-closed-outline', 'Reset Password', () =>
							router.push('/auth/reset_password')
						)}
						{renderSettingItem('help-circle-outline', 'Help & Support', () =>
							openURL('https://www.nanospeed.ca')
						)}
						{renderSettingItem('mail-outline', 'Contact Us', () =>
							openURL('mailto:app-support@nanospeed.ca')
						)}
					</View>

					<Text style={styles.sectionTitle}>Danger Zone</Text>
					<View style={styles.dangerZone}>
						<TouchableOpacity
							style={styles.dangerButton}
							onPress={() => router.push('/auth/delete_account')}
							activeOpacity={0.8}
						>
							<Ionicons name="trash-outline" size={20} color="#FF3B30" />
							<Text style={styles.dangerButtonText}>Delete Account</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.logoutButton}
							onPress={confirmLogout}
							disabled={isLoggingOut}
							activeOpacity={0.8}
						>
							{isLoggingOut ? (
								<ActivityIndicator color="white" size="small" />
							) : (
								<>
									<Ionicons name="log-out-outline" size={20} color="white" />
									<Text style={styles.logoutButtonText}>Logout</Text>
								</>
							)}
						</TouchableOpacity>
					</View>

					<Text style={styles.versionText}>Version 1.0.0</Text>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F8FA',
	},
	loadingContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	scrollContainer: {
		padding: 20,
		paddingTop: 15,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#EEEEEE',
	},
	backButton: {
		padding: 4,
	},
	placeholder: {
		width: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#000000',
	},
	profileSection: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 3.84,
		elevation: 5,
	},
	avatarContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#4A90E2',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 4,
	},
	profileEmail: {
		fontSize: 14,
		color: '#777777',
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: '600',
		color: '#555555',
		marginBottom: 10,
		marginLeft: 5,
	},
	card: {
		backgroundColor: 'white',
		borderRadius: 16,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: 24,
		overflow: 'hidden',
	},
	settingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F0',
	},
	iconWrapper: {
		width: 36,
		height: 36,
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 14,
	},
	settingText: {
		fontSize: 16,
		color: '#333333',
		flex: 1,
		fontWeight: '500',
	},
	dangerZone: {
		marginBottom: 30,
	},
	dangerButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFF1F0',
		padding: 16,
		borderRadius: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#FFDED8',
		shadowColor: '#FF3B30',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
		gap: 8,
	},
	dangerButtonText: {
		fontSize: 16,
		color: '#FF3B30',
		fontWeight: '500',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#4A90E2',
		padding: 16,
		borderRadius: 16,
		shadowColor: '#4A90E2',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 3.84,
		elevation: 5,
		gap: 8,
	},
	logoutButtonText: {
		fontSize: 16,
		color: 'white',
		fontWeight: '600',
	},
	versionText: {
		textAlign: 'center',
		color: '#999999',
		fontSize: 14,
		marginBottom: 30,
	},
});

export default Settings;
