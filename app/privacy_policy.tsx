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

const PrivacyPolicy: React.FC = () => {
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
				<Text style={styles.title}>Privacy Policy</Text>
				<View style={styles.placeholder} />
			</View>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<Text style={styles.sectionTitle}>NanoSpeed Privacy Notice</Text>
				<Text style={styles.versionDate}>Version Date: April 15, 2025</Text>

				<Text style={styles.sectionSubtitle}>Introduction</Text>
				<Text style={styles.sectionText}>
					This Privacy Notice (the "Privacy Notice") governs the use of the NanoSpeed app.
					By accepting this Privacy Notice, you consent to the transmission of your
					personal data, including health-related information, into a NanoSpeed cloud
					account that stores data within NanoSpeed's local region. BY ACCEPTING THIS
					PRIVACY NOTICE AND USING THE NANOSPEED APP, YOU CONFIRM THAT YOU ARE OF LEGAL
					AGE TO DO SO AND THAT YOU AGREE TO THESE TERMS EITHER ON YOUR OWN BEHALF OR ON
					BEHALF OF ANOTHER INDIVIDUAL FOR WHOM YOU HAVE LEGAL AUTHORITY TO ACT.
				</Text>

				<Text style={styles.sectionText}>
					NanoSpeed Diagnostics Inc., located at 1932 94 St NW, Edmonton AB, Canada, T6N
					1J3, owns the NanoSpeed app. You can reach us at this address or via email at{' '}
					<Text
						style={styles.link}
						onPress={() => openURL('mailto:app-support@nanospeed.ca')}
					>
						app-support@nanospeed.ca
					</Text>
					.
				</Text>

				<Text style={styles.sectionText}>In this Privacy Notice:</Text>
				<Text style={styles.sectionText}>
					"You," "your," or "user" refers to the individual using the NanoSpeed app.
				</Text>
				<Text style={styles.sectionText}>
					"NanoSpeed," "we," "us," or "our" refers to NanoSpeed Diagnostics Inc.
				</Text>

				<Text style={styles.sectionText}>
					NanoSpeed recognizes the importance of data protection and privacy and is
					committed to protecting your personal information and ensuring compliance with
					applicable privacy laws. This Privacy Notice describes how we handle your
					personal data, including health-related information, when you use the NanoSpeed
					app.
				</Text>

				<Text style={styles.sectionText}>
					This Privacy Notice does not cover data collected through other methods by
					NanoSpeed or its affiliates (e.g., websites or customer service centers) or
					third-party websites.
				</Text>

				<Text style={styles.emphasizedText}>
					YOUR USE OF THE NANOSPEED APP CONSTITUTES, AND IS EXPRESSLY CONDITIONED UPON,
					YOUR ACCEPTANCE OF THIS PRIVACY NOTICE AND AGREEMENT TO ITS TERMS. IN CERTAIN
					EXCEPTIONAL CASES, NANOSPEED'S DATA PROCESSORS MAY BE REQUIRED TO ACCESS YOUR
					PERSONAL INFORMATION, INCLUDING HEALTH-RELATED INFORMATION. BY ACCEPTING, YOU
					EXPRESSLY ACKNOWLEDGE THAT THIS PRIVACY NOTICE GOVERNS YOUR USE OF THE NANOSPEED
					APP AND THE NANOSPEED CLOUD, INCLUDING THE PROCESSING AND TRANSFER OF YOUR
					PERSONAL AND HEALTH-RELATED INFORMATION AS DESCRIBED HEREIN.
				</Text>

				{policies.map((policy, index) => (
					<View key={index} style={styles.policyContainer}>
						<Text style={styles.policyTitle}>{policy.title}</Text>
						<Text style={styles.policyDescription}>{policy.description}</Text>
					</View>
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

const policies = [
	{
		title: '1. Background of the NanoSpeed App and Cloud',
		description: `The NanoSpeed app enables users to capture an image of their NanoSpeed's Lateral Flow Assay (LFA) and instantly view their Vitamin D levels based on the results. The captured data is securely stored in the NanoSpeed cloud and lets the user to share their data with their health care provider or anyone that they choose to.\n\nThe NanoSpeed cloud operates on secure servers managed at Amazon Web Services (AWS) and local servers in the United States and Canada.\n\nTo use the NanoSpeed cloud, you may need a compatible smartphone, internet access (charges may apply), certain software (which may require a fee), and periodic updates. Cloud performance may vary depending on these requirements.`,
	},
	{
		title: '2. No Medical Advice',
		description:
			'THE NANOSPEED APP AND CLOUD ARE NOT INTENDED FOR DIAGNOSIS OR SCREENING OF ANY MEDICAL CONDITIONS. USERS SHOULD BE AWARE THAT THE NANOSPEED CLOUD IS AN INFORMATION MANAGEMENT SERVICE TO ENABLE THE ANALYSIS OF VITAMIN D LEVELS AND IS NOT INTENDED TO BE A SUBSTITUTE FOR THE ADVICE OF A HEALTH CARE PROFESSIONAL. These tools are designed for information management purposes only and should not replace professional medical advice. Always consult a qualified healthcare professional for any medical concerns or questions about your health metrics.\n\nNanoSpeed does not provide medical care or notify healthcare providers about changes in user readings. Users are responsible for sharing their health data with their providers as needed.\n\nYOUR DECISION TO TAKE ACTION BASED ON ANY INFORMATION TRANSMITTED TO OR STORED ON THE NANOSPEED CLOUD OR ON ANY INFORMATION RECEIVED FROM NANOSPEED EMPLOYEES, AGENTS, OR SUPPLIERS IS SOLELY AT YOUR OWN RISK.',
	},
	{
		title: '3. Unauthorized Third-Party Products',
		description:
			'Be cautious of third-party products claiming compatibility with the NanoSpeed app or cloud without authorization from NanoSpeed. We do not recommend or support such products and is not responsible if you do so. If you do use these third-party products or services, your use is subject to their respective privacy policies and terms of use.',
	},
	{
		title: '4. Scope of This Privacy Notice',
		description:
			'This Privacy Notice applies exclusively to personal information submitted through the NanoSpeed app when creating a cloud account and to the personal information, including health-related information, that we may receive from you or others (as explained in this notice) and stored within the NanoSpeed cloud. Data will be uploaded to the NanoSpeed cloud when you use the NanoSpeed app. This Privacy Notice does not apply to any other personal information provided by you or collected from you by NanoSpeed.',
	},
	{
		title: '5. Information Covered by This Privacy Notice',
		description:
			'The following types of personal information are governed by this Privacy Notice:\n\nThe NanoSpeed cloud account profile that you complete and which includes the name, date of birth, country, and email address of adult users for your own use or for use by another adult (where you have authority to do so).\n\nInformation we receive about your mobile device, including information about your interaction on the cloud and other troubleshooting and analytical data to help us provide the NanoSpeed app and NanoSpeed cloud to you.\n\nThe NanoSpeed app transmits personal information and data directly to the NanoSpeed cloud pursuant to this Privacy Notice.',
	},
	{
		title: '6. Handling Personal Information',
		description: `When you register for a NanoSpeed cloud account, your registration information—such as name, date of birth, and email address—is stored separately from the health data captured via the NanoSpeed app. We implement strict technical and administrative safeguards to ensure this separation and do not combine these data sets.\n\nPersonal Information\nNanoSpeed does not interface with your healthcare provider directly. However, users have the option to share their Vitamin D results with a healthcare professional by using the share card feature within the app. This sharing is voluntary and initiated entirely by the user.\n\nNanoSpeed collects and processes personal information, including data derived from your Vitamin D test results and mobile device, for the following purposes:\n\nTo store and manage your personal data securely in the NanoSpeed cloud, allowing you to access, back up, and retrieve your Vitamin D levels history—even if your device is lost or replaced.\nTo present your health-related information in a user-friendly format within the app.\nTo troubleshoot or resolve any technical issues you may report with the NanoSpeed app or cloud services.\n\nData Analysis\nNanoSpeed may utilize de-identified, pseudonymized, aggregated, and/or anonymized data for specific purposes, provided it aligns with our internal policies. This data is handled securely and is not used to identify you by name or email. Our purposes include:\n\nEnhancing the security, performance, and effectiveness of NanoSpeed's digital health tools.\nSupporting research, scientific study, and public health efforts related to Vitamin D management and other health conditions.\nSharing anonymized insights with affiliates, researchers, or public health bodies for statistical and analytical purposes.\nValidating new features and ensuring the cloud platform remains secure and reliable.\n\nNanoSpeed does not receive or manage personal data from healthcare providers and does not engage in data processing on their behalf. Any sharing of health data is controlled solely by the user.`,
	},
	{
		title: '7. Retention of Personal Information',
		description:
			'Your personal information is stored as long as your account remains active unless otherwise required by law or agreements with providers. The section entitled "How do I delete my NanoSpeed cloud account?" below explains how you can delete your account and what happens to your personal information once your account has been deleted.',
	},
	{
		title: '8. Sharing Personal Information',
		description:
			'NanoSpeed discloses personal information solely to authorized third-party providers for essential functions such as hosting, maintaining, and supporting the NanoSpeed cloud service.\n\nFor users accessing the app independently, and where allowed by our agreement, you agree to our use of de-identified, pseudonymized, aggregated, and/or anonymized information. This data may be shared with NanoSpeed-affiliated entities and other approved third parties for the "Data Analysis" purposes outlined earlier.',
	},
	{
		title: '9. Security Measures',
		description:
			'In compliance with HIPAA (U.S.) and the Personal Information Protection and Electronic Documents Act (PIPEDA, Canada), NanoSpeed has implemented administrative, technical, and physical measures to safeguard your personal and health-related information from unauthorized access, disclosure, loss, alteration, or destruction. These measures include the use of cryptographic technologies. Access to personal data is limited to employees who require it to perform their duties.\n\nHowever, please note that no internet or Wi-Fi transmission is entirely secure. We encourage you to take precautions when uploading sensitive information—particularly health-related data—to your NanoSpeed cloud account.\n\nYou are also responsible for securing your own devices and NanoSpeed account. We recommend using strong passwords, enabling device locks, and keeping login credentials confidential. NanoSpeed is not liable for any unauthorized access or misuse resulting from lost or compromised credentials under your control. If you suspect that your NanoSpeed cloud account has been compromised, please contact us promptly at app-support@nanospeed.ca.',
	},
	{
		title: '10. Data Storage Locations',
		description:
			'Personal information submitted to the NanoSpeed cloud is stored securely on regional servers located in the United States and Canada, managed by Amazon Web Services (AWS) and local hosting services depending on user location. AWS employs rigorous technical and organizational safeguards aligned with internationally recognized security standards, including certifications such as ISO 27001, ISO 27017, ISO 27018, PCI DSS Level 1, and SOC 1, 2, and 3.\n\nThese safeguards are independently verified by third-party auditors and are specifically designed to prevent unauthorized access to or disclosure of customer data. The security protocols followed by AWS are fully aligned with the requirements of HIPAA and PIPEDA.\n\nFor more information, visit: https://aws.amazon.com/compliance/hipaa-compliance/',
	},
	{
		title: '11. Marketing Communications',
		description:
			'NanoSpeed (or its affiliates) may send marketing and promotional content related to Vitamin D level management or other products and services to individuals who use the app independently—provided you have opted in to receive such communications when setting up your NanoSpeed cloud account, where legally required.\n\nIf you use the NanoSpeed app, you may:\nReceive personalized marketing content tailored to your specific needs, based on the data linked to your NanoSpeed cloud account (including health-related information).\nBe invited to participate in surveys, receive news and newsletters, or be informed about special offers and promotional campaigns.\nOpt out of marketing communications at any time by clicking the "unsubscribe" link in marketing emails, updating your preferences within the app, or contacting us directly at app-support@nanospeed.ca. We will honor your opt-out request promptly.\n\nAdditionally, NanoSpeed will never sell your personal information to third parties for direct marketing purposes.\n\nEven if you opt out of receiving marketing messages about Vitamin D level management, we may still send you important non-marketing updates—such as service notifications, security alerts, or cloud performance updates.',
	},
	{
		title: '12. How may I access and/or correct my personal information?',
		description:
			'You can update or modify your profile information directly through the NanoSpeed cloud account settings within the NanoSpeed app.\n\nIf you wish to make changes to your Vitamin D data readings stored in the NanoSpeed cloud, please note that editing or amending these values is not permitted. However, you may delete the data using the delete option available within your NanoSpeed app.',
	},
	{
		title: '13. What rights do I have over my personal information?',
		description:
			'For users outside the United States: Depending on your residence, you may have rights under applicable laws, including:\n\nAccessing the personal information, we hold about you.\nRequesting corrections to inaccurate personal information.\nDeleting personal information, we hold about you.\nRestricting the processing of your personal information.\nObjecting to the processing of your personal information.\nExporting personal information, you provided to us in a structured, machine-readable format or transmitting it to another organization using export functions in the NanoSpeed app.\n\nTo exercise these rights, contact us at app-support@nanospeed.ca.',
	},
	{
		title: '14. How do I delete my NanoSpeed cloud account?',
		description:
			'To delete your NanoSpeed cloud account, email us at app-support@nanospeed.ca. Please note:\n\nAggregated and de-identified data may be retained as required by law.\nOnce deleted, your account cannot be reactivated, and all associated data will be permanently erased from the NanoSpeed cloud. Ensure you download and save any necessary information before requesting deletion.',
	},
	{
		title: '15. How can I contact NanoSpeed?',
		description:
			'For questions, concerns, or complaints about our privacy practices:\nEmail us at app-support@nanospeed.ca.\nAlternatively, send a letter to:\n\nAttn: NanoSpeed Support\nNanoSpeed Diagnostics Inc.\n1932 94 St NW\nEdmonton, Alberta, Canada T6N 1J3\n\nInclude your NanoSpeed cloud account email address and a detailed explanation of your request in all communications.',
	},
	{
		title: '16. Changes to this Privacy Notice',
		description:
			'If changes are made to this Privacy Notice:\nUpdates will be reflected in a revised version accessible via email or the NanoSpeed app. Notifications will prompt you to review and accept the updated terms to continue using your account.\nWe reserve the right to amend this Privacy Notice without prior notice for technological advancements, legal updates, or business practices that do not alter its core privacy principles.\n\nIf you disagree with changes:\nDelete the NanoSpeed app from your device or request account deletion by contacting app-support@nanospeed.ca.',
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
		fontSize: 22,
		fontWeight: '700',
		color: '#333333',
		marginBottom: 5,
	},
	versionDate: {
		fontSize: 14,
		fontWeight: '500',
		color: '#777777',
		marginBottom: 15,
	},
	sectionSubtitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 8,
		marginTop: 5,
	},
	sectionText: {
		fontSize: 14,
		color: '#555555',
		marginBottom: 15,
		lineHeight: 20,
	},
	emphasizedText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 15,
		lineHeight: 20,
	},
	divider: {
		height: 1,
		backgroundColor: '#EEEEEE',
		marginVertical: 15,
	},
	policyContainer: {
		marginBottom: 20,
	},
	policyTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#333333',
		marginBottom: 8,
		marginTop: 10,
	},
	policyDescription: {
		fontSize: 14,
		color: '#555555',
		lineHeight: 20,
	},
	link: {
		color: '#007AFF',
		textDecorationLine: 'underline',
	},
});

export default PrivacyPolicy;
