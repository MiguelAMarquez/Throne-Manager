import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, King, Courtier } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const backgroundImg = require('../assets/3dec7a3e-9aaa-49a0-8dfe-656da6e01945.webp');

export default function LoginScreen({ navigation }: Props) {
    const [title, setTitle] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const fetchCourtiers = async (kingId: string) => {
        try {
            const response = await axios.get(`http://192.168.43.240:8080/api/kings/${kingId}/courtiers`);
            const courtiers = response.data as Courtier[];
            console.log('Courtiers fetched successfully:', courtiers);
        } catch (err) {
            console.error('Error fetching courtiers:', err);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.43.240:8080/api/auth/login', { title, password });
            if (response.status === 200) {
                const king: King = response.data;
                navigation.navigate('Court', {
                    kingId: king.id,
                    refreshCourtiers: () => fetchCourtiers(king.id)
                });
            } else {
                setMessage('YOU ARE AN IMPOSTOR!');
            }
        } catch (err) {
            setMessage('YOU ARE AN IMPOSTOR!');
        }
    };

    return (
        <ImageBackground source={backgroundImg} style={styles.background}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <View style={styles.errorMessageContainer}>
                        {message && (
                            <Text style={styles.errorMessage}>
                                {message}
                            </Text>
                        )}
                    </View>
                    <View style={styles.container}>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} />
                        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
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
        paddingTop: height * 0.38, 
    },
    input: {
        height: 30, 
        borderWidth: 0,
        borderRadius: 5,
        marginBottom: 16,
        paddingHorizontal: 10,
        width: '60%',
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    loginButton: {
        height: 40,
        width: '60%',
        marginBottom: 20,
        backgroundColor: 'transparent', 
    },
    registerButton: {
        height: 40,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(236,202,117,0.5)',
        borderRadius: 5,
    },
    registerButtonText: {
        color: 'black',
    },
    errorMessageContainer: {
        height: 20, 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    errorMessage: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
