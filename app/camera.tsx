import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	Image as RNImage,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useCameraPermission } from 'react-native-vision-camera';
import { CameraComponent } from '../components/CameraComponent';
import { ImagePreview } from '../components/ImagePreview';
import { useCameraActive, useLightSensor } from '../hooks/hooks';
import { useRouter } from 'expo-router';
import Instructions from '@/components/Instructions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { manipulateAsync } from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const STORAGE_KEY = 'instructions_do_not_show';

const ERROR_MESSAGES: Record<string, string> = {
	'Error 0': 'No valid prediction found. Please try again.',
	'Error 1': 'No valid prediction found. Please try again.',
	'Error 2': 'No valid prediction found. Move to a uniformly lit area and ensure no shadows.',
	'Error 3': 'No valid prediction found. Move to a uniformly lit area and ensure no shadows.',
	'Error 4': 'The image is blurred. Clean your camera lens and try again.',
	'Error 5': 'Move closer to the cassette and try again.',
	'Error 6': 'Ensure the cassette is right side up and try again.',
	'Error 7': 'The image is smudged. Please clean your camera and try again',
	'Error 8': 'Please ensure there are no shadows on the cassette and try again',
};

const showAlert = (title: string, message: string) => {
	console.log(`[Alert] ${title}: ${message}`);
	setTimeout(() => {
		Alert.alert(title, message, [{ text: 'OK' }]);
	}, 100);
};

const App: React.FC = () => {
	const { hasPermission, requestPermission } = useCameraPermission();
	const isCameraActive = useCameraActive();
	const { prompt } = useLightSensor();
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [galleryImage, setGalleryImage] = useState<any | null>(null);
	const [showInstructions, setShowInstructions] = useState(false);
	const [showImagePreview, setShowImagePreview] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkPermission = async () => {
			console.log('[Permission Check] Checking camera permissions...');
			if (!hasPermission) {
				await requestPermission();
				console.log('[Permission Request] Permission granted!');
			}
			if (hasPermission) {
				try {
					const doNotShow = await AsyncStorage.getItem(STORAGE_KEY);
					if (doNotShow !== 'true') {
						setShowInstructions(true);
						console.log('[UserDetails] Modal shown on camera load.');
					}
				} catch (error) {
					console.error('Failed to load instruction preferences: ', error);
					setShowInstructions(true);
				}
			}
		};
		checkPermission();
	}, [hasPermission, requestPermission]);

	if (!hasPermission) {
		return <ActivityIndicator size="large" style={styles.loader} />;
	}

	const handleTakePicture = async (path: string) => {
		try {
			console.log(`[Camera] Picture taken at path: ${path}`);
			const imageUri = Platform.OS === 'ios' ? path : `file://${path}`;

			// Fix image rotation using Expo Image Manipulator
			const rotatedImage = await manipulateAsync(imageUri, [{ rotate: 0 }], { compress: 1 });

			console.log(`[Camera] Processed Image URI: ${rotatedImage.uri}`);

			setOriginalImage(rotatedImage.uri);
			setGalleryImage(null);
			setShowImagePreview(true);
		} catch (error) {
			console.error('[Camera] Error capturing image:', error);
			showAlert('Error', 'Failed to capture the image.');
		}
	};

	const handleRetake = () => {
		setOriginalImage(null);
		setGalleryImage(null);
		setShowImagePreview(false);
	};

	const handleSend = async () => {
		try {
			setLoading(true);
			const imageUri = originalImage ?? galleryImage?.uri;
			if (!imageUri) throw new Error('No image available to send.');

			const formData = new FormData();
			formData.append('image', {
				uri: imageUri,
				type: galleryImage?.type ?? 'image/jpeg',
				name: galleryImage?.fileName ?? 'uploaded-image.jpg',
			} as any);

			const { data } = await axios.post(
				'https://muskox-darling-cobra.ngrok-free.app/process-image',
				formData,
				{ headers: { 'Content-Type': 'multipart/form-data' } }
			);

			const predictionMatch = data.result?.match(/Predicted Value:\s*([\d.]+)/);
			const errorMatch = data.result?.match(/Predicted Value:\s*(Error \d+)/);

			if (predictionMatch) {
				router.push(`/prediction/${parseFloat(predictionMatch[1])}`);
			} else if (errorMatch) {
				showAlert('Error', ERROR_MESSAGES[errorMatch[1]] || 'Unknown error.');
			} else {
				showAlert('Error', 'Unexpected response format.');
			}
		} catch (error: any) {
			showAlert('Error', error.message || 'Failed to process the image.');
		} finally {
			setLoading(false);
		}
	};

	const selectImage = () => {
		launchImageLibrary({ mediaType: 'photo' }, async (response) => {
			try {
				if (response.didCancel) return;
				if (response.errorCode) throw new Error(response.errorMessage);

				const selectedAsset = response.assets?.[0];
				if (!selectedAsset) throw new Error('No image selected.');

				setGalleryImage({ ...selectedAsset, uri: selectedAsset.uri });
				setOriginalImage(null);
				setShowImagePreview(true);
			} catch (error: any) {
				showAlert('Error', error.message || 'Failed to select an image.');
			}
		});
	};

	const handleDoNotShowInstruction = (doNotShow: boolean) => {
		console.log('User set to do not show again: ', doNotShow);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => router.push('/stepsPage')} style={styles.infoIcon}>
				<MaterialIcons name="info" size={36} color={'#fff'} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => router.push('/settings')} style={styles.profile}>
				<MaterialIcons name="settings" size={36} color={'#fff'} />
			</TouchableOpacity>

			<Instructions
				visible={showInstructions}
				onClose={() => setShowInstructions(false)}
				onDoNotShowAgain={handleDoNotShowInstruction}
			/>

			<CameraComponent isCameraActive={isCameraActive} onTakePicture={handleTakePicture} />
			<TouchableOpacity onPress={selectImage} style={styles.galleryButton}>
				<RNImage
					source={require('../assets/images/gallery.webp')}
					style={styles.galleryIcon}
				/>
			</TouchableOpacity>

			{prompt && (
				<View style={styles.promptContainer}>
					<Text style={styles.promptText}>{prompt}</Text>
				</View>
			)}

			<ImagePreview
				visible={showImagePreview}
				galleryImage={galleryImage}
				originalImage={originalImage}
				onRetake={handleRetake}
				onSend={handleSend}
				loading={loading}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1E1E1E',
		alignItems: 'center',
		justifyContent: 'center',
	},
	infoIcon: {
		position: 'absolute',
		top: 40,
		left: 20,
		fontSize: 30,
		color: '#fff',
		zIndex: 999,
	},
	profile: {
		position: 'absolute',
		top: 40,
		right: 20,
		fontSize: 30,
		color: '#fff',
		zIndex: 999,
	},
	galleryButton: {
		position: 'absolute',
		bottom: height * 0.1,
		width: 70,
		height: 70,
		borderRadius: 35,
		zIndex: 10,
		left: width * 0.1,
	},
	galleryIcon: {
		width: '100%',
		height: '100%',
		borderRadius: 35,
	},
	promptContainer: {
		position: 'absolute',
		top: height * 0.1,
		alignSelf: 'center',
		backgroundColor: 'rgba(0,0,0,0.8)',
		padding: 20,
		borderRadius: 15,
	},
	promptText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	gridContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'space-around',
	},
	gridLine: {
		flex: 1,
		borderBottomWidth: 1,
		borderColor: 'rgba(255,255,255,0.5)',
	},
	gridLineVertical: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		width: 1,
		backgroundColor: 'rgba(255,255,255,0.5)',
	},
	gridLineVertical1: {
		left: '33.33%',
	},
	gridLineVertical2: {
		left: '66.66%',
	},
	gridLineVertical3: {
		right: 0,
	},
});

export default App;
