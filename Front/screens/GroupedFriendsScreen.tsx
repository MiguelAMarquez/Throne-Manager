import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, Modal, TouchableOpacity, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Courtier, King } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Court'>;

type GroupedCourtiers = {
    title: string;
    data: Courtier[];
    color: string;
};

const backgroundImg = require('../assets/background 1.png');
const editImg = require('../assets/scroll.webp'); 
const exileImg = require('../assets/Dagger.webp'); 

const colors = ['#4B0082', '#483D8B', '#2F4F4F', '#1E90FF', '#8B0000', '#800080'];

export default function GroupedFriendsScreen({ route, navigation }: Props) {
    const { kingId } = route.params;
    const [groupedCourtiers, setGroupedCourtiers] = useState<GroupedCourtiers[]>([]);
    const [king, setKing] = useState<King>({
        id: '',
        title: '',
        password: '',
        name: '',
        lastname: '',
        horn: '',
        scroll: '',
        courtiers: [],
        courts: []
    });
    const [selectedCourtier, setSelectedCourtier] = useState<Courtier | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchCourtiers = async () => {
        try {
            const response = await axios.get(`http://192.168.43.240:8080/api/kings/${kingId}/courtiers`);
            const courtiers = response.data as Courtier[];
            const courtsMap: { [key: string]: Courtier[] } = {};

            courtiers.forEach(courtier => {
                if (courtier.courts && courtier.courts.length > 0) {
                    courtier.courts.forEach(court => {
                        if (court.trim() !== '') {
                            if (!courtsMap[court]) {
                                courtsMap[court] = [];
                            }
                            courtsMap[court].push(courtier);
                        }
                    });
                } else {
                    if (!courtsMap['No Court']) {
                        courtsMap['No Court'] = [];
                    }
                    courtsMap['No Court'].push(courtier);
                }
            });

            const grouped = Object.keys(courtsMap).sort().map((court, index) => ({
                title: court,
                data: courtsMap[court],
                color: colors[index % colors.length],
            }));
            setGroupedCourtiers(grouped);
        } catch (err) {
            console.error('Error fetching courtiers:', err);
        }
    };

    const fetchKing = async () => {
        try {
            const response = await axios.get(`http://192.168.43.240:8080/api/kings/${kingId}`);
            setKing(response.data);
        } catch (err) {
            console.error('Error fetching king:', err);
        }
    };

    const handleExile = async () => {
        if (selectedCourtier) {
            try {
                const response = await axios.delete(`http://192.168.43.240:8080/api/kings/${kingId}/courtiers/${selectedCourtier.name}`);
                if (response.status === 200) {
                    fetchCourtiers();
                    setModalVisible(false);
                }
            } catch (err) {
                console.error('Error exiling courtier:', err);
            }
        }
    };

    useEffect(() => {
        fetchKing();
        fetchCourtiers();
    }, []);

    return (
        <ImageBackground source={backgroundImg} style={styles.background}>
            <SectionList
                sections={groupedCourtiers}
                keyExtractor={(item, index) => item.scroll + index}
                renderItem={({ item, section }) => (
                    <View style={[styles.courtierItem, { backgroundColor: section.color, borderColor: '#D4AF37' }]}>
                        <Text style={styles.courtierName}>{item.name} {item.lastname}</Text>
                        <Text style={styles.courtierDetail}>{item.horn}</Text>
                        <Text style={styles.courtierDetail}>{item.scroll}</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditCourtier', { kingId, courtier: item, refreshCourtiers: fetchCourtiers })} style={styles.circularButton}>
                                <Image source={editImg} style={styles.buttonImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setSelectedCourtier(item); setModalVisible(true); }} style={styles.circularButton}>
                                <Image source={exileImg} style={styles.buttonImage} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section: { title, color } }) => (
                    <View style={[styles.sectionHeader, { backgroundColor: color, borderColor: '#D4AF37' }]}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <View style={styles.container}>
                        <Text style={styles.kingTitle}>KING</Text>
                        <View style={styles.kingInfo}>
                            <Text style={styles.kingInfoText}>Title: {king.title}</Text>
                            <Text style={styles.kingInfoText}>Name: {king.name} {king.lastname}</Text>
                            <Text style={styles.kingInfoText}>Scroll: {king.scroll}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('ThroneRoom', { king, refreshCourtiers: fetchCourtiers })} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Go to Throne Room</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListFooterComponent={() => (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                            <View style={tw`bg-white p-5 rounded-lg`}>
                                <Text style={tw`text-xl mb-5`}>Noble king, if you exile this courtier, they will be removed from the court. Are you sure you want to proceed?</Text>
                                <View style={tw`flex-row justify-between`}>
                                    <TouchableOpacity onPress={handleExile} style={styles.circularButtonModal}>
                                        <Image source={exileImg} style={styles.buttonImageModal} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.circularButtonModal}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            />
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
    container: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: height * 0.1,
    },
    kingTitle: {
        fontSize: 24,
        color: '#D4AF37',
        marginBottom: 20,
        textAlign: 'center',
    },
    kingInfo: {
        width: '100%',
        padding: 20,
        backgroundColor: 'transparent',
        borderRadius: 10,
        marginBottom: 20,
    },
    kingInfoText: {
        fontSize: 18,
        color: '#D4AF37',
        marginBottom: 5,
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#D4AF37',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
    sectionListContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 10,
    },
    courtierItem: {
        padding: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 2,
    },
    courtierName: {
        fontSize: 18,
        color: '#fff',
    },
    courtierDetail: {
        fontSize: 14,
        color: '#fff',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    circularButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 5,
    },
    circularButtonModal: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 5,
    },
    buttonImage: {
        width: "100%",
        height: "100%",
        borderRadius: 30
    },
    buttonImageModal: {
        width: 50,
        height: 50,
    },
    cancelText: {
        fontSize: 16,
        color: '#000',
    },
    sectionHeader: {
        fontSize: 22,
        padding: 10,
        textAlign: 'center',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 2,
    },
    sectionHeaderText: {
        color: '#D4AF37',
    },
});
