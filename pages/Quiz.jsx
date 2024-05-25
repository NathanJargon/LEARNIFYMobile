import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import { Button, Snackbar, Text, Portal, Modal } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

import QuestionCard from "../components/Quiz/QuestionCard";
import { useEffect, useState } from "react";
import baseURL from "../utils/baseURL";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebase } from "../utils/FirebaseConfig";


export default function Quiz({ route, navigation }) {
  // Decode the ID before using it
  const id = route.params.id;
  const [serverError, setServerError] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [visible, setVisible] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [activityNumber, setActivityNumber] = useState("");
  const [answers, setAnswers] = useState([]);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [userToken, setUserToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('email').then(email => {
      console.log("User Email: " + email);
      setUserEmail(email);
    });
  }, []);

  const submitQuiz = async () => {
    let score = 0;
    
    for (let i = 0; i < quiz.length; i++) {
      console.log(`Question ${i + 1}: Selected answer index = ${answers[i]}, Correct answer index = ${quiz[i].correctAnswer}`);
      
      if (Number(answers[i]) === Number(quiz[i].correctAnswer)) {
        score++;
      }
    }
    
    alert(`Your score: ${score}/${quiz.length}`);  

  
    if (userEmail) {
      console.log("User Email: " + userEmail);

      const db = getFirestore();
      const docRef = doc(db, "activities", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const activityData = docSnap.data();

        if (!activityData.ActivityResult) {
          activityData.ActivityResult = [];
        }

        // Check if a result for the current user already exists
        const existingResultIndex = activityData.ActivityResult.findIndex(
          (result) => result.userEmail === userEmail
        );

        if (existingResultIndex !== -1) {
          // If a result for the current user already exists, replace it with the new result
          activityData.ActivityResult[existingResultIndex] = {
            userEmail: userEmail,
            score: score,
          };
        } else {
          // If no result for the current user exists, add the new result
          activityData.ActivityResult.push({
            userEmail: userEmail,
            score: score,
          });
        }

        const courseId = activityData.ActivityResult.find(
          (result) => result.userEmail === userEmail
        )?.courseId;

        // Update the Firestore document
        await updateDoc(docRef, {
          ActivityResult: activityData.ActivityResult,
        });

        console.log("Activity result has been saved.");

        console.log("Id: " + id);

        navigation.navigate("Course", {id: courseId});
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("User email not found in Firebase");
    }
  };

  const onDismissSnackBarHandler = () => setServerError("");

  useEffect(() => {
    getQuiz();
  }, []);

  const getQuiz = async () => {
    try {
      const db = getFirestore();
      const docRef = doc(db, "activities", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data()); // Log the fetched data
        setQuiz(docSnap.data().questions);
        setAnswers(new Array(docSnap.data().questions.length).fill(-1));      
        setActivityName(docSnap.data().activityName); // replace "activityName" with your field name
        setActivityNumber(docSnap.data().activityNumber); // replace "activityNumber" with your field name
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log('Error fetching document:', error); // Log any errors
      setServerError(error.message);
    }
  };

  const handleAnswerSelect = (answer, index) => {
    // Find the index of the selected answer
    const answerIndex = quiz[index].choices.indexOf(answer);
  
    console.log(`Selected answer index: ${answerIndex}`); // Log the index of the selected answer
  
    // Update the answer for the current question
    const newAnswers = [...answers];
    newAnswers[index] = answerIndex;
    setAnswers(newAnswers);
  
    console.log(newAnswers);
  };
  
  const Questions = quiz.map((question, index) => (
    <QuestionCard
      key={index}
      questionNumber={index + 1}
      question={question.question}
      choices={question.choices}
      onAnswerSelect={(answer) => handleAnswerSelect(answer, index)}
    />
  ));

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.cover, { backgroundColor: theme.colors.primary }]}>
      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.onPrimary }]}
      >
        {activityName} - {activityNumber}
      </Text>
        {/* <Text
          variant="titleLarge"
          style={[styles.score, { color: theme.colors.onPrimary }]}
        >
          2/3
        </Text> */}
      </View>

      <View style={styles.content}>
        <View>{Questions}</View>

        <Button
          style={styles.submitButton}
          onPress={submitQuiz}
          mode="contained"
        >
          Submit
        </Button>

        {/* Temp Modal for Score */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.scoreModal}
          >
            <Text variant="titleMedium" style={{ textAlign: "center" }}>
              Your Score:
            </Text>
            <Text
              style={[styles.score, { color: theme.colors.primary }]}
              variant="displayLarge"
            >
              2/2
            </Text>
            <Button
              style={styles.submitButton}
              mode="contained"
              onPress={() => navigation.navigate("Home")}
            >
              Close
            </Button>
          </Modal>
        </Portal>
      </View>

      <Snackbar
        style={styles.snackBar}
        visible={serverError}
        onDismiss={onDismissSnackBarHandler}
      >
        {serverError}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  title: {
    fontWeight: "bold",
  },
  cover: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 16,
  },
  score: {
    fontWeight: "bold",
  },
  content: {
    rowGap: 20,
    padding: 14,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 10,
    padding: 2,
  },
  snackBar: {
    marginHorizontal: 14,
    backgroundColor: "red",
  },
  scoreModal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  score: {
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
  },
});
