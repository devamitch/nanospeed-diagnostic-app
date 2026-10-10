import { useState, useEffect } from 'react'
import { Platform } from 'react-native';
import { useAppState } from '@react-native-community/hooks';
import SystemSetting from 'react-native-system-setting';
const maxValue = Platform.select({ ios: 0.8, android: 0.4, default: 0.3 });
const minValue = Platform.select({ ios: 0.2, android: 0.01, default: 0.7 });
export const useCameraActive = () => {
	const currentAppState = useAppState();
	const [isCameraActive, setIsCameraActive] = useState(true);

	useEffect(() => {
		setIsCameraActive(currentAppState === 'active');
	}, [currentAppState]);

	return isCameraActive;
};

export const useLightSensor = () => {
	const [lightLevel] = useState(0);
	const [prompt, setPrompt] = useState('');

	useEffect(() => {
		const interval = setInterval(async () => {
			const currentBrightness = await SystemSetting.getBrightness();
			if (currentBrightness < minValue) {
				setPrompt('Please move to a brighter place.');
			} else if (currentBrightness > maxValue) {
				setPrompt("It's too bright! Move to a dimmer place.");
			} else {
				setPrompt('');
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return { lightLevel, prompt };
};
