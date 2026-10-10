import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const TermsOfService: React.FC = () => {
	const openURL = (url: string) => {
		Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#F7F8FA" />
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
					hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
				>
					<Ionicons name="chevron-back" size={24} color="#007AFF" />
				</TouchableOpacity>
				<Text style={styles.title}>Terms of Service</Text>
				<View style={styles.placeholder} />
			</View>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text style={styles.sectionTitle}>
					Terms of Service Agreement for NanoSpeed App
				</Text>
				<Text style={styles.sectionText}>Effective Date: April 15, 2025</Text>
				<Text style={styles.sectionText}>
					PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE USING THE NANOSPEED APP. BY
					ACCESSING OR USING THE APP, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT
					AGREE, DO NOT USE THE APP.
				</Text>
				<View style={styles.divider} />
				{terms.map((term, index) => (
					<View key={index} style={styles.termContainer}>
						<Text style={styles.termTitle}>{term.title}</Text>
						{term.description.map((paragraph, pIndex) => (
							<Text key={pIndex} style={styles.termDescription}>
								{paragraph}
							</Text>
						))}
					</View>
				))}
				<View style={styles.divider} />
				<Text style={styles.sectionText}>
					By using the NanoSpeed App, you acknowledge that you have read, understood, and
					agree to these Terms of Service and the NanoSpeed Privacy Notice.
				</Text>
				<Text style={styles.sectionText}>
					For account deletion or queries, contact us at{' '}
					<Text
						style={styles.link}
						onPress={() => openURL('mailto:app-support@nanospeed.ca')}
					>
						app-support@nanospeed.ca
					</Text>
					.
				</Text>
				<Text style={styles.sectionText}>
					Learn more about us at{' '}
					<Text style={styles.link} onPress={() => openURL('https://www.nanospeed.ca')}>
						https://www.nanospeed.ca
					</Text>
					.
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

const terms = [
	{
		title: '1. Acceptance of Terms',
		description: [
			'By creating an account or using the NanoSpeed app ("App"), you agree to these Terms of Service ("Terms") and the NanoSpeed Privacy Notice. If you are using the App on behalf of another individual, you confirm you have legal authority to do so.',
		],
	},
	{
		title: '2. Eligibility',
		description: [
			'You must be of legal age in your jurisdiction to use the App. Users must voluntarily confirm that they are over 18 years of age to use the NanoSpeed App and its services. By using the App, you represent and warrant that you meet this requirement.',
		],
	},
	{
		title: '3. Account Registration',
		description: [
			'To access features of our services, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account password and for any activities or actions under your account. You agree to notify us immediately of any unauthorized use of your account.',
		],
	},
	{
		title: '4. Description of Service',
		description: [
			`The App enables users to capture images of NanoSpeed's Lateral Flow Assay (LFA) and view Vitamin D levels. Data is stored in the NanoSpeed cloud, allowing users to access, back up, and share their results with healthcare providers or others at their discretion. The App is not intended for diagnosis or screening of any medical condition and does not provide medical advice.`,
		],
	},
	{
		title: '5. No Medical Advice',
		description: [
			'The App and cloud are for information management only. They do not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns. NanoSpeed does not notify healthcare providers of changes in user readings. Actions taken based on information from the App are at your own risk.',
		],
	},
	{
		title: '6. User Responsibilities',
		description: [
			'You are responsible for maintaining the confidentiality of your account credentials.',
			'You must use a compatible device, maintain internet access, and keep your software updated.',
			'You are responsible for securing your device and account. NanoSpeed is not liable for unauthorized access resulting from lost or compromised credentials.',
		],
	},
	{
		title: '7. Prohibited Activities',
		description: [
			'You agree not to:',
			'• Use our services for any illegal or unauthorized purpose.',
			'• Interfere with or disrupt the integrity or performance of our services.',
			'• Attempt to gain unauthorized access to our services or related systems or networks.',
			'• Use our services to transmit any malicious code, viruses, or harmful software.',
			"• Engage in any activity that could damage, disable, overburden, or impair our services or interfere with any other party's use of our services.",
		],
	},
	{
		title: '8. Data Privacy and Security',
		description: [
			'Your use of the App is governed by the NanoSpeed Privacy Notice, which details how your personal and health-related information is collected, used, stored, and protected. Data is stored on secure servers in the United States and Canada, managed by Amazon Web Services (AWS), and local servers based on your location protected by administrative, technical, and physical safeguards in compliance with HIPAA and PIPEDA.',
		],
	},
	{
		title: '9. User Content and Data Sharing',
		description: [
			"You may voluntarily share your Vitamin D results with healthcare professionals or others using the App's share feature.",
			'NanoSpeed does not interface directly with healthcare providers and does not process data on their behalf.',
			'De-identified, pseudonymized, aggregated, or anonymized data may be used for research, analytics, and platform improvement, as described in the Privacy Notice.',
		],
	},
	{
		title: '10. Third-Party Products and Services',
		description: [
			'NanoSpeed does not endorse or support third-party products or services claiming compatibility with the App unless explicitly authorized. Use of such products is at your own risk and subject to their terms and privacy policies.',
		],
	},
	{
		title: '11. Account Termination and Data Deletion',
		description: [
			'You may delete your NanoSpeed cloud account at any time by contacting app-support@nanospeed.ca.',
			'Upon deletion, your account and associated data will be permanently erased, except for aggregated or de-identified data retained as required by law.',
			'Deleted accounts cannot be reactivated. Download any necessary information before requesting deletion.',
		],
	},
	{
		title: '12. Intellectual Property',
		description: [
			'All content, trademarks, and intellectual property in the App are owned by NanoSpeed Diagnostics Inc. or its licensors. You may not copy, modify, distribute, or create derivative works without express permission.',
		],
	},
	{
		title: '13. Disclaimers and Limitation of Liability',
		description: [
			'Disclaimers',
			'The App and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our services will be uninterrupted, error-free, or free of viruses or other harmful components.',
			'To the fullest extent permitted by law, in no event shall NanoSpeed Diagnostics Inc., its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your use or inability to use our services; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein; (iii) any interruption or cessation of transmission to or from our services; (iv) any bugs, viruses, trojan horses, or the like that may be transmitted to or through our services by any third party; (v) any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through our services; and/or (vi) the defamatory, offensive, or illegal conduct of any third party.',
		],
	},
	{
		title: '14. Indemnification',
		description: [
			'You agree to indemnify and hold harmless NanoSpeed Diagnostics Inc., its affiliates, officers, employees, and agents from any claims, damages, liabilities, and expenses arising from your use of the App, violation of these Terms, or infringement of any rights of a third party.',
		],
	},
	{
		title: '15. Modifications to Terms',
		description: [
			'NanoSpeed may update these Terms at any time. Changes will be communicated via the App or email. Continued use of the App after changes constitutes acceptance of the new Terms. If you disagree with changes, discontinue use and request account deletion.',
		],
	},
	{
		title: '16. Governing Law',
		description: [
			'These Terms are governed by the laws of Alberta, Canada, without regard to conflict of law principles. Any disputes will be resolved in the courts of Alberta, Canada.',
		],
	},
	{
		title: '17. Contact Information',
		description: [
			'For questions or concerns about these Terms or the App, contact:',
			'NanoSpeed Diagnostics Inc.',
			'1932 94 St NW',
			'Edmonton, Alberta, Canada T6N 1J3',
			'Email: app-support@nanospeed.ca',
		],
	},
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F8FA',
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
	scrollContainer: {
		padding: 20,
		paddingBottom: 40,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 10,
	},
	sectionText: {
		fontSize: 14,
		color: '#555555',
		marginBottom: 15,
		lineHeight: 20,
	},
	divider: {
		height: 1,
		backgroundColor: '#EEEEEE',
		marginVertical: 15,
	},
	termContainer: {
		marginBottom: 20,
	},
	termTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 5,
	},
	termDescription: {
		fontSize: 14,
		color: '#555555',
		lineHeight: 20,
		marginBottom: 8,
	},
	link: {
		color: '#007AFF',
		textDecorationLine: 'underline',
	},
});

export default TermsOfService;
