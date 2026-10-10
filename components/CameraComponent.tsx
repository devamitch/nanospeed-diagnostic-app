import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

interface CameraComponentProps {
	isCameraActive: boolean;
	loading?: boolean;
	onTakePicture: (path: string) => void;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
	isCameraActive,
	onTakePicture,
}) => {
	const device = useCameraDevice('back');
	const camera = useRef<Camera>(null);

	const onTakePicturePressed = async () => {
		if (camera.current == null) {
			console.error('Camera ref is not initialized');
			return;
		}
		try {
			const photo = await camera.current.takePhoto({
				enableShutterSound: true,
			});
			console.log('Photo captured:', photo);
			onTakePicture(photo.path);
		} catch (error) {
			console.error('Error capturing photo:', error);
		}
	};

	if (device == null) return null;

	const screenWidth = Dimensions.get('window').width;
	const screenHeight = Dimensions.get('window').height;

	const blankHeight = screenHeight * 0.6;
	const blankWidth = blankHeight / 3;

	const sideWidth = (screenWidth - blankWidth) / 2;
	const topBottomHeight = (screenHeight - blankHeight) / 2;

	return (
		<View style={StyleSheet.absoluteFill}>
			<Camera
				ref={camera}
				device={device}
				isActive={isCameraActive}
				style={StyleSheet.absoluteFill}
				photo={true}
			/>

			<View
				style={[
					styles.border,
					{
						left: 0,
						width: sideWidth,
						height: screenHeight,
						top: 0,
					},
				]}
			/>

			<View
				style={[
					styles.border,
					{
						right: 0,
						width: sideWidth,
						height: screenHeight,
						top: 0,
					},
				]}
			/>

			<View
				style={[
					styles.border,
					{
						top: 0,
						height: topBottomHeight,
						width: blankWidth,
						left: sideWidth,
					},
				]}
			/>

			<View
				style={[
					styles.border,
					{
						bottom: 0,
						height: topBottomHeight,
						width: blankWidth,
						left: sideWidth,
					},
				]}
			/>

			<TouchableOpacity onPress={onTakePicturePressed} style={styles.captureButton} />

			<View style={styles.black} />
		</View>
	);
};

const styles = StyleSheet.create({
	captureButton: {
		position: 'absolute',
		bottom: 90,
		width: 75,
		height: 75,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		borderColor: 'white',
		borderWidth: 5,
		borderRadius: 75,
		alignSelf: 'center',
		zIndex: 10,
	},

	border: {
		position: 'absolute',
		backgroundColor: 'rgba(179,179,179,0.5)',
		zIndex: 5,
	},
	black: {
		top: '100%',
		position: 'absolute',
		backgroundColor: 'black',
		zIndex: 5,
		width: '100%',
		height: '5%',
	},
});
