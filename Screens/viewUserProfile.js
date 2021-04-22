import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/FontAwesome";

//Need to import data of the friendship status
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16,
        marginLeft: 390
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#000000"
    },
    dm: {
        backgroundColor: "#FFFFFF",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#000000"

    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000000"
    },
    add: {
        backgroundColor: "#FFFFFF",
        position: "absolute",
        bottom: 0,
        right: 135,
        width: 55,
        height: 55,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#000000"
    },
    ban: {
        backgroundColor: "#FFFFFF",
        position: "absolute",
        bottom: 135,
        right: 0,
        width: 55,
        height: 55,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#000000"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    }

});

const UserProfile = (props) => {
    let [enabled, setEnabled] = useState(false);
    let [disabledMessage, setDisabledMessage] = useState('');
    let [isFriend, setIsFriend] = useState(false);

    let { user } = props.route.params;
    //console.log(user);

    const addFriendAlert = () => {
        if (!enabled) {
            Alert.alert("Add Friend", disabledMessage);
            return;
        }
        Alert.alert(
            "Add Friend",
            "Do you want to add this user as a friend?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        //console.log("Cancel Pressed");
                    },
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => addFriend() }
            ],
            { cancelable: false }
        );
    }
    const blockUser = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        let blockURI = `https://bussin.blakekjohnson.dev/api/block/${user._id}`;
        let blockResponse = await fetch(blockURI, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(blockResponse.status);

        props.navigation.goBack();
    };

    const createReportAlert = () => {
        Alert.alert(
            "Report or Block User",
            "Do you want to report or block this user?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        //console.log("Cancel Pressed");
                    },
                    style: "cancel"
                },
                {
                    text: "Block", onPress: () => {
                        blockUser();
                    }
                },
                {
                    text: "Report and Block", onPress: () => {
                        props.navigation.navigate('Report', { user });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const updateEnabled = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;

        let res = await fetch('https://bussin.blakekjohnson.dev/api/user', {
            headers: { 'Authorization': `Bearer ${token}`, },
        });
        res = await res.json();

        if (res.user._id == user._id) {
            setEnabled(false);
            setDisabledMessage('Cannot add self as friend.');
            return;
        }
        if (user.friends.includes(res.user._id)) {
            setEnabled(false);
            setDisabledMessage('User is already friends.');
            setIsFriend(true);
            return;
        }
        setEnabled(true);
    }

    useEffect(() => {
        updateEnabled();
    }, [user]);

    const addFriend = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return;
        let res = await fetch(`https://bussin.blakekjohnson.dev/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res = await res.json();

        res = await fetch('https://bussin.blakekjohnson.dev/api/friends/', {
            method: 'POST',
            body: JSON.stringify({
                request: {
                    to: user._id,
                    from: res.user._id,
                }
            }),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.status != 200) {
            res = await res.json();
            //console.log(res);
            return;
        }
        res = await res.json();
        //console.log(res);
    };
    return (
        <SafeAreaView style={styles.container}>
            {user && <>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleBar}>
                    </View>
                    <View style={{ alignSelf: "center" }}>
                        <View style={styles.profileImage}>
                            <Image source={{ uri: user.profilePhoto }} style={styles.image} resizeMode="center"></Image>
                        </View>
                        <View style={styles.ban}>
                            <Icon name='ban' size={30} onPress={createReportAlert}></Icon>
                        </View>
                        <View style={styles.add}>
                            {!isFriend && <Icon name="plus" size={30} color="#B92126" style={{ marginTop: 6, marginLeft: 2 }} onPress={addFriendAlert}></Icon>}
                            {isFriend && <Icon name="check" size={30} color="#059033" style={{ marginTop: 6, marginLeft: 2 }}></Icon>}
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{user.name}</Text>
                        <Text style={[styles.text, { color: "#AEB5BC", fontSize: 20 }]}>{user.username}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, { fontSize: 24 }]}>{user.eventPoints}</Text>
                            <Text style={[styles.text, styles.subText]}>Bussin Score</Text>
                        </View>
                        <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderRightWidth: 1, borderLeftWidth: 1 }]}>
                            <Text style={[styles.text, { fontSize: 24 }]}>{user.friends.length}</Text>
                            <Text style={[styles.text, styles.subText]}>Friends</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, { fontSize: 24 }]}>{user.organizations.length}</Text>
                            <Text style={[styles.text, styles.subText]}>Organizations</Text>
                        </View>

                    </View>
                </ScrollView>
            </>
            }
        </SafeAreaView>
    );

};

export default UserProfile;
