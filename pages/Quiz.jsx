import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import { Button, Snackbar, Text, Portal, Modal } from "react-native-paper";

import QuestionCard from "../components/Quiz/QuestionCard";
import { useEffect, useState } from "react";
import { getSecureStore } from "../utils/SecureStore";
import baseURL from "../utils/baseURL";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebase } from "../utils/FirebaseConfig";

export default function Quiz({ route, navigation }) {
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

  useEffect(() => {
    const token = getSecureStore("userToken");
    setUserToken(token);
    console.log("User Token: " + token);
  }, []);

  const submitQuiz = async () => {
    let score = 0;

    for (let i = 0; i < quiz.length; i++) {
      if (answers[i] === quiz[i].correctAnswer) {
        score++;
      }
    }

    alert(`Your score: ${score}/${quiz.length}`);

    const user = firebase.auth().currentUser;
    const userEmail = user ? user.email : null;    
  
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

        // Update the Firestore document
        await updateDoc(docRef, {
          ActivityResult: activityData.ActivityResult,
        });

        console.log("Activity result has been saved.");
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
        setQuiz(docSnap.data().questions); // assuming "questions" is the field name in your document
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

  const handleAnswerSelect = (answer) => {
    // Update the answer for the current question
    const newAnswers = [...answers];
    newAnswers[questionNumber - 1] = answer;
    setAnswers(newAnswers);
  };

  const Questions = quiz.map((question, index) => (
    <QuestionCard
      key={index}
      questionNumber={index + 1}
      question={question.question}
      choices={question.choices}
      onAnswerSelect={handleAnswerSelect}
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
