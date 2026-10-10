import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	StatusBar,
	SafeAreaView,
	ActivityIndicator,
	Share,
	Dimensions,
	Platform,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface ChecklistItem {
	text: string;
	completed: boolean;
}

const CHECKLIST_INITIAL: ChecklistItem[] = [
	{ text: 'Processing image', completed: false },
	{ text: 'Analyzing sample quality', completed: false },
	{ text: 'Calculating results', completed: false },
];

const VITAMIN_D_RANGES = {
	deficient: { min: 0, max: 32, color: '#FF5252', label: 'Deficient' },
	sufficient: { min: 32, max: 100, color: '#4CAF50', label: 'Sufficient' },
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

const Results = () => {
	const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(CHECKLIST_INITIAL);
	const [allCompleted, setAllCompleted] = useState(false);
	const [username, setUsername] = useState('Guest');
	const [isSharing, setIsSharing] = useState(false);
	const resultsCardRef = useRef(null);

	const { id: prediction } = useLocalSearchParams<{ id?: string }>();
	const vitaminDLevel = Number(prediction) || 0;
	const date = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const getVitaminDStatus = (level: number) => {
		if (level < VITAMIN_D_RANGES.deficient.max)
			return {
				status: VITAMIN_D_RANGES.deficient.label,
				color: VITAMIN_D_RANGES.deficient.color,
			};

		return {
			status: VITAMIN_D_RANGES.sufficient.label,
			color: VITAMIN_D_RANGES.sufficient.color,
		};
	};

	const vitaminDStatus = getVitaminDStatus(vitaminDLevel);
	const progress = Math.min(Math.max(vitaminDLevel / 100, 0), 1);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUsername(user.displayName || user.email || 'User');
			} else {
				setUsername('Guest');
			}
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		checklistItems.forEach((_, index) => {
			setTimeout(() => {
				setChecklistItems((prevItems) =>
					prevItems.map((item, i) => (i === index ? { ...item, completed: true } : item))
				);
			}, index * 600);
		});
	}, []);

	useEffect(() => {
		const completed = checklistItems.every((item) => item.completed);
		if (completed) {
			setTimeout(() => {
				setAllCompleted(true);
			}, 400);
		}
	}, [checklistItems]);

	const handleExit = () => {
		router.push('/');
	};

	const handleShare = async () => {
		try {
			setIsSharing(true);

			// Capture the screenshot
			const uri = await captureRef(resultsCardRef, {
				format: 'jpg',
				quality: 0.9,
			});

			// For Android: Save to a known location in app's cache directory
			if (Platform.OS === 'android') {
				const filename = `vitamin-d-results-${Date.now()}.jpg`;
				const filePath = `${FileSystem.cacheDirectory}${filename}`;

				// Copy the captured image to the new location
				await FileSystem.copyAsync({
					from: uri,
					to: filePath,
				});

				// Share with expo-sharing which handles content URIs properly
				if (await Sharing.isAvailableAsync()) {
					await Sharing.shareAsync(filePath, {
						mimeType: 'image/jpeg',
						dialogTitle: 'Share Your Vitamin D Results',
						UTI: 'public.jpeg',
					});
				} else {
					// Fallback to React Native Share
					await Share.share({
						message: `My Vitamin D test results: ${vitaminDLevel} ng/mL (${vitaminDStatus.status}) - Tested on ${date}`,
						title: 'My Vitamin D Results',
						url: filePath,
					});
				}
			} else {
				// For iOS: Direct sharing works fine
				await Share.share({
					message: `My Vitamin D test results: ${vitaminDLevel} ng/mL (${vitaminDStatus.status}) - Tested on ${date}`,
					title: 'My Vitamin D Results',
					url: uri,
				});
			}
		} catch (error) {
			console.error('Error sharing results:', error);
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<Animated.View entering={FadeIn} style={styles.header}>
				<TouchableOpacity onPress={handleExit} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Test Results</Text>
				<View style={{ width: 24 }} />
			</Animated.View>

			<View style={styles.container}>
				{!allCompleted && (
					<Animated.View entering={FadeInUp.delay(100)} style={styles.userInfo}>
						<Text style={styles.username}>Result for {username}</Text>
						<Text style={styles.date}>{date}</Text>
					</Animated.View>
				)}

				{!allCompleted && (
					<Animated.View
						entering={FadeInUp.delay(200)}
						style={styles.processingContainer}
					>
						<View style={styles.processingHeader}>
							<Text style={styles.processingTitle}>Processing Results</Text>
							<ActivityIndicator size="small" color="#0cc0e1" />
						</View>

						<View style={styles.checklist}>
							{checklistItems.map((item, index) => (
								<View key={index} style={styles.checklistItem}>
									{item.completed ? (
										<View style={styles.checkCircleCompleted}>
											<Ionicons
												name="checkmark-sharp"
												size={16}
												color="#FFFFFF"
											/>
										</View>
									) : (
										<View style={styles.checkCirclePending}>
											<ActivityIndicator size="small" color="#0cc0e1" />
										</View>
									)}
									<Text style={styles.checklistText}>{item.text}</Text>
								</View>
							))}
						</View>
					</Animated.View>
				)}

				{allCompleted && (
					<Animated.View
						ref={resultsCardRef}
						entering={FadeInUp.delay(300)}
						style={[styles.resultsCard, styles.sharableCard]}
					>
						<View style={styles.cardHeader}>
							<Text style={styles.cardHeaderTitle}>Result for {username}</Text>
						</View>

						<Text style={styles.resultTitle}>Predicted Vitamin D Level</Text>

						<View style={styles.resultValueContainer}>
							<Text style={[styles.resultValue, { color: vitaminDStatus.color }]}>
								{vitaminDLevel}
							</Text>
							<Text style={[styles.resultUnit, { color: vitaminDStatus.color }]}>
								ng/mL
							</Text>
						</View>

						<View
							style={[styles.statusBadge, { backgroundColor: vitaminDStatus.color }]}
						>
							<Text style={styles.statusText}>{vitaminDStatus.status}</Text>
						</View>

						<View style={styles.progressContainer}>
							<View style={styles.progressBarContainer}>
								<View
									style={[
										styles.progressBarFill,
										{
											width: `${progress * 100}%`,
											backgroundColor: vitaminDStatus.color,
										},
									]}
								/>
							</View>
						</View>

						<View style={styles.interpretation}>
							<Text style={styles.interpretationTitle}>Disclaimer</Text>
							<Text style={styles.interpretationText}>
								This result is for informational purposes only and should not be
								used for clinical or diagnostic purposes. Please consult your
								healthcare professional for any health-related concerns.
							</Text>
						</View>

						<View style={styles.cardFooter}>
							<Text style={styles.cardFooterTitle}>Nanospeed</Text>
							<Text style={styles.cardHeaderDate}>{date}</Text>
						</View>
					</Animated.View>
				)}

				{allCompleted && (
					<Animated.View
						entering={FadeInUp.delay(400)}
						style={styles.actionButtonsContainer}
					>
						<TouchableOpacity
							style={styles.shareButton}
							onPress={handleShare}
							disabled={isSharing}
						>
							{isSharing ? (
								<ActivityIndicator size="small" color="#FFFFFF" />
							) : (
								<>
									<Ionicons
										name="share-outline"
										size={20}
										color="#FFFFFF"
										style={styles.buttonIcon}
									/>
									<Text style={styles.buttonText}>Share Results</Text>
								</>
							)}
						</TouchableOpacity>
					</Animated.View>
				)}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},
	container: {
		flex: 1,
		backgroundColor: '#F8F9FC',
		padding: 20,
		paddingBottom: 40,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 16,
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F5',
		width: '100%',
		zIndex: 10,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333333',
		textAlign: 'center',
	},
	backButton: {
		padding: 4,
	},
	userInfo: {
		marginBottom: 24,
		alignItems: 'center',
	},
	username: {
		fontSize: isSmallDevice ? 20 : 24,
		fontWeight: 'bold',
		color: '#333333',
		marginBottom: 4,
		textAlign: 'center',
	},
	date: {
		fontSize: isSmallDevice ? 14 : 16,
		color: '#6D7587',
		textAlign: 'center',
	},
	processingContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: isSmallDevice ? 16 : 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 2,
		marginBottom: 20,
		width: '100%',
	},
	processingHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	processingTitle: {
		fontSize: isSmallDevice ? 16 : 18,
		fontWeight: '600',
		color: '#333333',
	},
	checklist: {
		marginTop: 8,
	},
	checklistItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		flexWrap: 'nowrap',
	},
	checkCirclePending: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#F0F0F5',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
		flexShrink: 0,
	},
	checkCircleCompleted: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: '#4CAF50',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 16,
		flexShrink: 0,
	},
	checklistText: {
		fontSize: isSmallDevice ? 14 : 16,
		color: '#333333',
		flexShrink: 1,
	},
	resultsCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: isSmallDevice ? 16 : 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 2,
		marginBottom: 20,
		alignItems: 'center',
		width: '100%',
	},
	sharableCard: {
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	cardHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#F0F0F5',
	},
	cardFooter: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 16,
		paddingTop: 16,
		borderTopWidth: 1,
		borderColor: '#F0F0F5',
	},
	cardHeaderTitle: {
		fontSize: isSmallDevice ? 16 : 18,
		fontWeight: 'bold',
	},
	cardFooterTitle: {
		fontSize: isSmallDevice ? 16 : 18,
		fontWeight: 'bold',
		color: '#0cc0e1',
	},
	cardHeaderDate: {
		fontSize: isSmallDevice ? 12 : 14,
		color: '#6D7587',
	},
	resultTitle: {
		fontSize: isSmallDevice ? 16 : 18,
		color: '#6D7587',
		marginBottom: 8,
		textAlign: 'center',
	},
	resultValueContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		marginBottom: 16,
		flexWrap: 'nowrap',
	},
	resultValue: {
		fontSize: isSmallDevice ? 40 : 48,
		fontWeight: 'bold',
	},
	resultUnit: {
		fontSize: isSmallDevice ? 16 : 18,
		fontWeight: '600',
		marginLeft: 4,
		marginBottom: 8,
	},
	statusBadge: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginBottom: 24,
	},
	statusText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: isSmallDevice ? 14 : 16,
	},
	progressContainer: {
		width: '100%',
		marginTop: 8,
	},
	progressBarContainer: {
		width: '100%',
		height: 8,
		backgroundColor: '#F0F0F5',
		borderRadius: 4,
		marginBottom: 12,
		overflow: 'hidden',
	},
	progressBarFill: {
		height: '100%',
		borderRadius: 4,
	},
	rangeLabels: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 24,
	},
	rangeLabel: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rangeDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginRight: 4,
		flexShrink: 0,
	},
	rangeLabelText: {
		fontSize: isSmallDevice ? 12 : 14,
		color: '#6D7587',
	},
	interpretation: {
		width: '100%',
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: '#F0F0F5',
	},
	interpretationTitle: {
		fontSize: isSmallDevice ? 14 : 16,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 8,
	},
	interpretationText: {
		fontSize: isSmallDevice ? 12 : 14,
		lineHeight: isSmallDevice ? 18 : 20,
		color: '#6D7587',
	},
	userLabel: {
		marginTop: 16,
		fontSize: isSmallDevice ? 12 : 14,
		color: '#9AA0B0',
		alignSelf: 'flex-end',
	},
	actionButtonsContainer: {
		width: '100%',
		gap: 12,
		marginBottom: 16,
	},
	shareButton: {
		backgroundColor: '#0cc0e1',
		borderRadius: 12,
		paddingVertical: 14,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	buttonIcon: {
		marginRight: 8,
	},
	buttonText: {
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: isSmallDevice ? 14 : 16,
	},
	disclaimerContainer: {
		marginTop: 20,
		width: '100%',
		paddingHorizontal: isSmallDevice ? 4 : 24,
	},
	disclaimer: {
		color: '#9AA0B0',
		fontSize: isSmallDevice ? 10 : 12,
		textAlign: 'center',
		marginBottom: Platform.OS === 'ios' ? 8 : 16,
	},
});

export default Results;
