import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddCourtier'>;

const backgroundImg = require('../assets/background 1.png');

export default function AddCourtierScreen({ route, navigation }: Props) {
    const { kingId } = route.params;
    const [courtierInfo, setCourtierInfo] = useState({
        name: '',
        lastname: '',
        horn: '',
        scroll: '',
        courts: []
    });
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPhoneNumberValid = (phoneNumber) => {
        return phoneNumber.length >= 11;
    };

    const handleAddCourtier = async () => {
        if (!isPhoneNumberValid(courtierInfo.horn)) {
            setPhoneError('Phone number must be at least 11 digits long.');
            return;
        } else {
            setPhoneError('');
        }

        if (!isEmailValid(courtierInfo.scroll)) {
            setEmailError('Invalid email format.');
            return;
        } else {
            setEmailError('');
        }

        try {
            const response = await axios.post(`http://192.168.43.240:8080/api/kings/${kingId}/courtiers`, courtierInfo);
            if (response.status === 200) {
                setMessage('Courtier added successfully');
                navigation.goBack();
            } else {
                setMessage('Error adding courtier');
            }
        } catch (err) {
            setMessage('Error adding courtier');
        }
    };

    const handleBlur = (field) => {
        if (field === 'horn') {
            if (!isPhoneNumberValid(courtierInfo.horn)) {
                setPhoneError('Phone number must be at least 11 digits long.');
            } else {
                setPhoneError('');
            }
        }

        if (field === 'scroll') {
            if (!isEmailValid(courtierInfo.scroll)) {
                setEmailError('Invalid email format.');
            } else {
                setEmailError('');
            }
        }
    };

    return (
        <ImageBackground source={backgroundImg} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="#D4AF37"
                            value={courtierInfo.name}
                            onChangeText={(text) => setCourtierInfo({ ...courtierInfo, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Lastname"
                            placeholderTextColor="#D4AF37"
                            value={courtierInfo.lastname}
                            onChangeText={(text) => setCourtierInfo({ ...courtierInfo, lastname: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Horn (Phone Number)"
                            placeholderTextColor="#D4AF37"
                            value={courtierInfo.horn}
                            onChangeText={(text) => setCourtierInfo({ ...courtierInfo, horn: text })}
                            keyboardType="numeric"
                            onBlur={() => handleBlur('horn')}
                        />
                        {phoneError ? <Text style={styles.errorMessage}>{phoneError}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Scroll (Email)"
                            placeholderTextColor="#D4AF37"
                            value={courtierInfo.scroll}
                            onChangeText={(text) => setCourtierInfo({ ...courtierInfo, scroll: text })}
                            keyboardType="email-address"
                            onBlur={() => handleBlur('scroll')}
                        />
                        {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
                        <TouchableOpacity onPress={handleAddCourtier} style={styles.addButtonContainer}>
                            <LinearGradient
                                colors={['#D4AF37', '#FFD700']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.addButton}
                            >
                                <Text style={styles.addButtonText}>Add Courtier</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        {message && (
                            <Text style={[styles.errorMessage, message.includes('successfully') ? styles.successMessage : null]}>
                                {message}
                            </Text>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: height * 0.1,
    },
    input: {
        height: 50,
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 10,
        paddingHorizontal: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
        color: '#D4AF37',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    addButtonContainer: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 10,
    },
    addButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'black',
        fontSize: 18,
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
    },
});
