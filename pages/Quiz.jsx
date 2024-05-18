import { StyleSheet, View, StatusBar, ScrollView } from "react-native";
import { Button, Snackbar, Text, Portal, Modal } from "react-native-paper";

import QuestionCard from "../components/Quiz/QuestionCard";
import { useEffect, useState } from "react";
import { getSecureStore } from "../utils/SecureStore";
import baseURL from "../utils/baseURL";

export default function Quiz({ route, navigation }) {
  const id = route.params.id;
  const userToken = getSecureStore("userToken");
  const [serverError, setServerError] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const submitQuiz = () => {
    showModal();

    //wala pay fetch sa score
  };

  const onDismissSnackBarHandler = () => setServerError("");

  useEffect(() => {
    getQuiz();
  }, []);

  const getQuiz = async () => {
    try {
      const url = `${baseURL}/api/quiz/${id}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      };
      const res = await fetch(url, requestOptions);
      const data = await res.json();
      setQuiz(data);
    } catch (error) {
      setServerError(error.message);
    }
  };

  const Questions = quiz.map((quiz) => (
    <QuestionCard
      questionNumber={quiz.question_number}
      question={quiz.question}
      choices={quiz.choices}
    />
  ));

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.cover, { backgroundColor: theme.colors.primary }]}>
        <Text
          variant="titleLarge"
          style={[styles.title, { color: theme.colors.onPrimary }]}
        >
          QUIZ {id}
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
