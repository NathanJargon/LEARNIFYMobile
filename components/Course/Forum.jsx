import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, StyleSheet, View, ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../utils/FirebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { ReplyComment, PostComment } from "./ForumComment";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Forum({ forums, courseId }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(forums);
  const [isSubmitting, setIsSubmitting] = useState(false); // new state variable
  const [email, setEmail] = useState("Anonymous");
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      setEmail(email);
      setIsLoading(false); // Set loading to false after the email is retrieved
    });
    setComments(forums);
  }, [forums]);  

  const fetchComments = async () => {
    try {
      const db = firebase.firestore();
      const doc = await db.collection('courses').doc(courseId).get();
      if (doc.exists) {
        setComments(doc.data().comments);
      }
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim() === '') {
      Alert.alert('Cannot post empty comment');
      return;
    }

    setIsSubmitting(true); // disable the submit button

    try {
      const db = firebase.firestore();
  
      const newComment = {
        text: commentText,
        date: new Date(),
        userEmail: email,
      };
  
      await db.collection('courses').doc(courseId).set({
        comments: firebase.firestore.FieldValue.arrayUnion(newComment),
      }, { merge: true });
  
      setCommentText('');
      Alert.alert('Comment posted', '', [{ text: 'OK', onPress: () => setIsSubmitting(false) }]); // re-enable the submit button after the alert is dismissed
      fetchComments(); // refresh comments
    } catch (error) {
      console.error("Error updating document: ", error);
      setIsSubmitting(false); // re-enable the submit button if there was an error
    }
  };


  const renderItems = ({ item, index }) => {
    const date = item.date.toDate();
    const dateString = date.toLocaleString();
    const user = item.userEmail || "Anonymous"; // Use userEmail if it exists, otherwise use "Anonymous"

    if (item.text.includes("Reply")) {
      return <ReplyComment key={index} message={item.text} date={dateString} user={user} />;
    } else {
      return <PostComment key={index} message={item.text} date={dateString} user={user} />; // Pass user prop to PostComment
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.body}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={comments}
        renderItem={renderItems}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.secondary }}>No Forums</Text>
        }
      />

      <KeyboardAvoidingView style={styles.bottomFields}>
        <TextInput 
          mode="outlined" 
          style={styles.commentField} 
          value={commentText}
          onChangeText={text => setCommentText(text)}
        />
        <Ionicons 
          name="send" 
          size={24} 
          color={theme.colors.primary} 
          onPress={handleCommentSubmit}
          disabled={isSubmitting} // disable the button while submitting
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 80,
  },
  bottomFields: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    bottom: 0,
    right: 0,
    left: 0,
    height: 80,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  commentField: {
    flex: 1,
    borderRadius: 16,
  },
});
