import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { firebase } from "../utils/FirebaseConfig";
import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Notification({ navigation }) {
  const route = useRoute();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      console.log('Current user:', user); // Log the current user

      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "users", user.email));

        console.log('User document:', userDoc.data()); // Log the user document

        if (userDoc.exists()) {
          console.log('Notifications in user document:', userDoc.data().notifications); // Log the notifications in the user document
          setNotifications(userDoc.data().notifications);
        }
      }
    };

    fetchNotifications();
  }, []);

  console.log('notifications:', notifications);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.lineBreak} />
        {notifications && notifications.map(({imageUri, title}, index) => {
          console.log('imageUri:', imageUri);
          console.log('text:', title);
          return (
            <View key={index}>
              <View style={styles.notificationItem}>
                <Image source={{ uri: imageUri }} style={styles.notificationImage} />
                <Text style={styles.notificationText}>{title}</Text>
              </View>
              <View style={styles.lineBreak} />
            </View>
          );
        })}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../assets/Icons/back.png')} style={styles.backImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 10,
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    overflow: 'hidden',
    borderRadius: 25,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lineBreak: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
  backImage: {
    width: 40,
    height: 40,
  },
    firstNotificationItem: {
      marginTop: 20,
    },
});