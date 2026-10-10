import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';

const video = require('../assets/videos/Instruction_ manual_05.mp4');

const StepsPage: React.FC = () => {
	const player = useVideoPlayer(video, (player) => {
		(player.loop = true), player.play();
	});

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<Text style={styles.header}>Steps</Text>
			<VideoView
				style={styles.video}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
			/>
			<TouchableOpacity style={styles.fab} onPress={() => router.push('/camera')}>
				<Text style={styles.fabText}>Get Started</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingTop: 50,
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	video: {
		width: '100%',
		height: '80%',
	},
	controlsContainer: {
		padding: 10,
	},
	fab: {
		position: 'absolute',
		bottom: 30,
		alignSelf: 'center',
		backgroundColor: 'transparent',
		paddingVertical: 10,
		paddingHorizontal: 40,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: '#000',
	},
	fabText: {
		color: '#000',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default StepsPage;
