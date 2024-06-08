import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GroupedFriendsScreen from '../screens/GroupedFriendsScreen';
import EditFriendScreen from '../screens/EditCourtierScreen';
import AddFriendScreen from '../screens/AddCourtierScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { RootStackParamList, King } from '../utils/types';
import tw from 'twrnc';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HeaderRight = ({ king, refreshCourtiers }: { king: King; refreshCourtiers: () => void }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('ThroneRoom', { king, refreshCourtiers })}>
            <Text style={tw`text-white mr-4`}>{king.title}</Text>
        </TouchableOpacity>
    );
};

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#0F1429',
                        
                    },
                    headerTintColor: '#ffffff', 
                    headerTitleStyle: {
                        color: '#ffffff',
                    },
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Your Castle' }} />
                <Stack.Screen
                    name="ThroneRoom"
                    component={ProfileScreen}
                    options={({ route }) => ({
                        title: 'Throne Room',
                        headerRight: () => route.params && <HeaderRight king={route.params.king} refreshCourtiers={route.params.refreshCourtiers} />
                    })}
                />
                <Stack.Screen
                    name="Court"
                    component={GroupedFriendsScreen}
                    options={({ route }) => ({
                        title: 'Courtiers by Court',
                        headerRight: () => route.params && <HeaderRight king={{ id: route.params.kingId, title: 'King', name: '', lastname: '', horn: '', scroll: '', password: '' }} refreshCourtiers={route.params.refreshCourtiers} />
                    })}
                />
                <Stack.Screen name="EditCourtier" component={EditFriendScreen} options={{ title: 'Edit Courtier' }} />
                <Stack.Screen name="AddCourtier" component={AddFriendScreen} options={{ title: 'Add Courtier' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
