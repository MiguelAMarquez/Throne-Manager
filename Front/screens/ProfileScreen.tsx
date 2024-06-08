import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ImageBackground, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ScrollView, Modal, Button, Image } from 'react-native';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ThroneRoom'>;

const backgroundImg = require('../assets/profi.png');
const updateIcon = require('../assets/crown.webp');
const courtroomIcon = require('../assets/Throne.webp');
const addCourtierIcon = require('../assets/Subject.webp');
const dieIcon = require('../assets/Dagger.webp');

export default function ProfileScreen({ route, navigation }: Props) {
    const { king, refreshCourtiers } = route.params;
    const [kingInfo, setKingInfo] = useState(king);
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isPhoneNumberValid = (phoneNumber) => {
        return phoneNumber.length >= 11;
    };

    const isPasswordValid = (password) => {
        return password.length >= 7;
    };

    const handleUpdate = async () => {
        if (!isPhoneNumberValid(kingInfo.horn)) {
            setPhoneError('Phone number must be at least 11 digits long.');
            return;
        } else {
            setPhoneError('');
        }

        if (!isEmailValid(kingInfo.scroll)) {
            setEmailError('Invalid email format.');
            return;
        } else {
            setEmailError('');
        }

        if (!isPasswordValid(kingInfo.password)) {
            setPasswordError('Password must be at least 7 characters long.');
            return;
        } else {
            setPasswordError('');
        }

        try {   
            const response = await axios.put(`http://192.168.43.240:8080/api/kings/${kingInfo.id}`, kingInfo);
            if (response.status === 200) {
                setMessage('Profile updated successfully');
            } else {
                setMessage('Error updating profile');
            }
        } catch (err) {
            setMessage('Error updating profile');
        }
    };

    const handleBlur = (field) => {
        if (field === 'horn') {
            if (!isPhoneNumberValid(kingInfo.horn)) {
                setPhoneError('Phone number must be at least 11 digits long.');
            } else {
                setPhoneError('');
            }
        }

        if (field === 'scroll') {
            if (!isEmailValid(kingInfo.scroll)) {
                setEmailError('Invalid email format.');
            } else {
                setEmailError('');
            }
        }

        if (field === 'password') {
            if (!isPasswordValid(kingInfo.password)) {
                setPasswordError('Password must be at least 7 characters long.');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://192.168.43.240:8080/api/kings/${kingInfo.id}`);
            if (response.status === 200) {
                setMessage('Profile deleted successfully');
                navigation.navigate('Login');
            } else {
                setMessage('Error deleting profile');
            }
        } catch (err) {
            setMessage('Error deleting profile');
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
                        {message && (
                            <Text style={[styles.errorMessage, message.includes('successfully') ? styles.successMessage : null]}>
                                {message}
                            </Text>
                        )}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleUpdate} style={styles.circleButton}>
                                <Image source={updateIcon} style={styles.fullSizeImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { refreshCourtiers(); navigation.navigate('Court', { kingId: kingInfo.id, refreshCourtiers }); }} style={styles.circleButton}>
                                <Image source={courtroomIcon} style={styles.fullSizeImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('AddCourtier', { kingId: kingInfo.id, refreshCourtiers })} style={styles.circleButton}>
                                <Image source={addCourtierIcon} style={styles.fullSizeImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.circleButton}>
                                <Image source={dieIcon} style={styles.fullSizeImage} />
                            </TouchableOpacity>
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                                <View style={tw`bg-white p-5 rounded-lg`}>
                                    <Text style={tw`text-xl mb-5`}>Noble king, if you die, your court will be disbanded. Are you sure you want to proceed?</Text>
                                    <View style={tw`flex-row justify-between`}>
                                        <Button title="Confirm" onPress={handleDelete} />
                                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                                    </View>
                                </View>
                            </View>
                        </Modal>
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
        paddingTop: height * 0.25, 
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
        color: '#D4AF37',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    fullSizeImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
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
