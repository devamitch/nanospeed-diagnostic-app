import React from 'react';
import {
	ActivityIndicator,
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Asset } from 'react-native-image-picker';

interface ImagePreviewProps {
	visible: boolean;
	loading: boolean;
	originalImage: string | null;
	galleryImage: Asset | null;
	onRetake: () => void;
	onSend: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
	visible,
	galleryImage,
	originalImage,
	onRetake,
	onSend,
	loading,
}) => {
	return (
		<Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onRetake}>
			<View style={styles.modalContainer}>
				{(originalImage || galleryImage) && (
					<Image
						source={{ uri: galleryImage?.uri ?? originalImage ?? '' }}
						style={styles.previewImage}
					/>
				)}
				<View style={styles.modalButtons}>
					<TouchableOpacity style={styles.button} onPress={onRetake}>
						<Text style={styles.buttonText}>Retake</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={onSend} disabled={loading}>
						{loading ? (
							<ActivityIndicator color="black" />
						) : (
							<Text style={styles.buttonText}>Send</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.8)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	previewImage: {
		width: 350,
		height: 350,
		marginBottom: 30,
		borderRadius: 20,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '80%',
	},
	button: {
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 20,
		marginHorizontal: 10,
		width: 100,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: 'black',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 18,
	},
});
