import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { firebase } from "../utils/FirebaseConfig";
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notification({ navigation }) {
  const route = useRoute();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const db = getFirestore();
      const userEmail = await AsyncStorage.getItem('email');
  
      if (userEmail) {
        const activitiesSnapshot = await getDocs(collection(db, 'activities'));
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
  
        console.log('activitiesSnapshot:', activitiesSnapshot.docs.map(doc => doc.data()));
        console.log('coursesSnapshot:', coursesSnapshot.docs.map(doc => doc.data()));
  
        const activitiesPromises = activitiesSnapshot.docs.map(async (docData) => {
          const activity = docData.data();
          const notificationContent = `${activity.userEmail} has created a new activity named ${activity.activityName}`;
          const docId = `${activity.userEmail}${activity.activityName}`;

          // Check if any field is undefined or empty
          if (activity.userEmail && activity.activityName) {
            // Check if a document with the same ID already exists
            const docRef = doc(db, 'notifications', docId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
              // Add the notification to the notifications collection
              await setDoc(docRef, {
                text: notificationContent,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            }
          }
        });

        const coursesPromises = coursesSnapshot.docs.map(async (docData) => {
          const course = docData.data();
          const notificationContent = `${course.userEmail} has created a new course named ${course.courseName}`;
          const docId = `${course.userEmail}${course.courseName}`;

          // Check if any field is undefined or empty
          if (course.userEmail && course.courseName) {
            // Check if a document with the same ID already exists
            const docRef = doc(db, 'notifications', docId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
              // Add the notification to the notifications collection
              await setDoc(docRef, {
                text: notificationContent,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
            }
          }
        });
  
        // Wait for all promises to resolve
        await Promise.all([...activitiesPromises, ...coursesPromises]);
  
        // Fetch the notifications
        const notificationsSnapshot = await getDocs(collection(db, 'notifications'));
        const notifications = notificationsSnapshot.docs.map(doc => doc.data());
  
        console.log('fetched notifications:', notifications);

        setNotifications(notifications);
      }
    };
  
    fetchNotifications();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.lineBreak} />
      <ScrollView>
        {notifications && notifications.map((notification, index) => {
          console.log('notification:', notification);
          return (
            <View key={index}>
              <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification.text}</Text>
              </View>
              <View style={styles.lineBreak} />
            </View>
          );
        })}
      </ScrollView>
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