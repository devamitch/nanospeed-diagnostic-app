import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface InstructionsProps {
	visible: boolean;
	onClose: () => void;
	onDoNotShowAgain: (doNotShow: boolean) => void;
}

const STORAGE_KEY = 'instructions_do_not_show';

const Instructions: React.FC<InstructionsProps> = ({ visible, onClose, onDoNotShowAgain }) => {
	const [isChecked, setChecked] = useState(false);

	useEffect(() => {
		const loadSavedPreference = async () => {
			try {
				const savedValue = await AsyncStorage.getItem(STORAGE_KEY);
				if (savedValue === 'true') {
					setChecked(true);
				}
			} catch (error) {
				console.error('Failed to load preferences: ', error);
			}
		};
		loadSavedPreference();
	}, []);

	const handleCheckboxChange = async (newValue: boolean) => {
		setChecked(newValue);

		try {
			await AsyncStorage.setItem(STORAGE_KEY, newValue.toString());
			onDoNotShowAgain(newValue);
		} catch (error) {
			console.error('Failed to save preference: ', error);
		}
	};

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{/* Header */}
						<View style={styles.header}>
							<Text style={styles.title}>Instructions</Text>
							<View style={styles.divider} />
						</View>

						{/* Instructions Content */}
						<ScrollView
							style={styles.scrollContainer}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}
						>
							<View style={styles.instructionsContainer}>
								{/* Step 1 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>1</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											Please use the black cloth provided to clean the camera
										</Text>
									</View>
								</View>

								{/* Step 2 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>2</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											Place the cassette on the black cloth
										</Text>
									</View>
								</View>

								{/* Step 3 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>3</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											Center the cassette on the camera viewfinder and capture
											an image
										</Text>
									</View>
								</View>

								{/* Step 4 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>4</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											In the preview window, ensure that the image is clear,
											and in focus
										</Text>
									</View>
								</View>

								{/* Step 5 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>5</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											If there is an issue with the image, a pop-up explaining
											the issues will be displayed
										</Text>
									</View>
								</View>

								{/* Step 6 */}
								<View style={styles.instructionItem}>
									<View style={styles.stepNumberContainer}>
										<Text style={styles.stepNumber}>6</Text>
									</View>
									<View style={styles.stepContentContainer}>
										<Text style={styles.stepInfo}>
											Press Submit, and wait for few seconds for the results.
										</Text>
									</View>
								</View>
							</View>
						</ScrollView>

						{/* Footer */}
						<View style={styles.footer}>
							<View style={styles.checkboxContainer}>
								<Checkbox
									style={styles.checkbox}
									value={isChecked}
									onValueChange={handleCheckboxChange}
									color={isChecked ? '#4c669f' : undefined}
								/>
								<Text style={styles.checkboxLabel}>Do not show again</Text>
							</View>

							<TouchableOpacity
								style={styles.closeButton}
								onPress={onClose}
								activeOpacity={0.8}
							>
								<Text style={styles.closeButtonText}>Close</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '90%',
		maxWidth: 450,
		maxHeight: height * 0.8,
		backgroundColor: 'transparent',
	},
	modalContent: {
		backgroundColor: 'white',
		borderRadius: 24,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 10,
	},
	header: {
		paddingTop: 24,
		paddingBottom: 16,
		paddingHorizontal: 24,
		backgroundColor: 'white',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333',
		textAlign: 'center',
		marginBottom: 12,
	},
	divider: {
		height: 1,
		backgroundColor: '#E5E5E5',
		marginHorizontal: -24,
	},
	scrollContainer: {
		maxHeight: isSmallScreen ? height * 0.4 : height * 0.5,
	},
	scrollContent: {
		paddingHorizontal: 24,
		paddingVertical: 16,
	},
	instructionsContainer: {
		gap: 16,
	},
	instructionItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 16,
	},
	stepNumberContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: '#4c669f',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 2,
	},
	stepNumber: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold',
	},
	stepContentContainer: {
		flex: 1,
	},
	stepInfo: {
		fontSize: 16,
		lineHeight: 22,
		color: '#333',
	},
	footer: {
		padding: 24,
		borderTopWidth: 1,
		borderTopColor: '#E5E5E5',
	},
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		marginRight: 10,
	},
	checkboxLabel: {
		fontSize: 16,
		color: '#555',
	},
	closeButton: {
		backgroundColor: '#4c669f',
		borderRadius: 16,
		paddingVertical: 16,
		alignItems: 'center',
		shadowColor: '#4c669f',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	closeButtonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
});

export default Instructions;
