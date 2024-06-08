import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const backgroundImg = require('../assets/regis.png');

export default function RegisterScreen({ navigation }: Props) {
    const [kingInfo, setKingInfo] = useState({
        title: '',
        password: '',
        name: '',
        lastname: '',
        horn: '',
        scroll: ''
    });
    const [message, setMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPhoneNumberValid = (phoneNumber) => {
        return phoneNumber.length >= 11;
    };

    const isPasswordValid = (password) => {
        return password.length >= 8;
    };

    const handleRegister = async () => {
        const { password, horn, scroll } = kingInfo;

        let valid = true;

        if (!isPasswordValid(password)) {
            setPasswordError('Password must be at least 8 characters long.');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (!isPhoneNumberValid(horn)) {
            setPhoneError('Phone number must be at least 11 digits long.');
            valid = false;
        } else {
            setPhoneError('');
        }

        if (!isEmailValid(scroll)) {
            setEmailError('Invalid email format.');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!valid) {
            return;
        }

        try {
            const response = await axios.post('http://192.168.43.240:8080/api/auth/register', kingInfo);
            if (response.status === 200) {
                setMessage('Registration successful');
                navigation.navigate('Login');
            } else {
                setMessage('Error registering king');
            }
        } catch (err) {
            setMessage('Error registering king');
        }
    };

    const handleBlur = (field) => {
        const { password, horn, scroll } = kingInfo;

        if (field === 'password') {
            if (!isPasswordValid(password)) {
                setPasswordError('Password must be at least 8 characters long.');
            } else {
                setPasswordError('');
            }
        }

        if (field === 'horn') {
            if (!isPhoneNumberValid(horn)) {
                setPhoneError('Phone number must be at least 11 digits long.');
            } else {
                setPhoneError('');
            }
        }

        if (field === 'scroll') {
            if (!isEmailValid(scroll)) {
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
                            placeholder="Title"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.title}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, title: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.password}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, password: text })}
                            secureTextEntry
                            onBlur={() => handleBlur('password')}
                        />
                        {passwordError ? <Text style={styles.errorMessage}>{passwordError}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.name}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Lastname"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.lastname}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, lastname: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Horn (Phone Number)"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.horn}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, horn: text })}
                            keyboardType="numeric"
                            onBlur={() => handleBlur('horn')}
                        />
                        {phoneError ? <Text style={styles.errorMessage}>{phoneError}</Text> : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Scroll (Email)"
                            placeholderTextColor="#D4AF37"
                            value={kingInfo.scroll}
                            onChangeText={(text) => setKingInfo({ ...kingInfo, scroll: text })}
                            keyboardType="email-address"
                            onBlur={() => handleBlur('scroll')}
                        />
                        {emailError ? <Text style={styles.errorMessage}>{emailError}</Text> : null}
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
                        {message && (
                            <Text style={[styles.errorMessage, message.includes('successful') ? styles.successMessage : null]}>
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
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: height * 0.3,
    },
    input: {
        height: 40,
        borderColor: 'transparent',
        borderWidth: 1,
        borderRadius: 25,
        marginBottom: 10,
        paddingHorizontal: 20,
        width: '80%',
        backgroundColor: '#FFFCF0', 
        color: '#ECCA75', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    registerButtonContainer: {
        width: '80%',
        borderRadius: 25,
        marginBottom: 20,
    },
    registerButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: "80%",
        borderRadius: 25,
        backgroundColor: "#ECCA75",
    },
    registerButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
    },
})
