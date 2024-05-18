import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";

export default function QuestionCard({ questionNumber, question, choices }) {
  const [answer, setAnswer] = useState("first");

  const QuestionContent = (
    <RadioButton.Group
      onValueChange={(newAnswer) => setAnswer(newAnswer)}
      value={answer}
    >
      {choices?.map((option) => {

        return (
          <>
            <RadioButton.Item
              key={option.id}
              style={styles.answerOption}
              label={option.choice}
              value={option.choice}
            />
            <View style={{ height: 14 }} />
          </>
        );
      })}
    </RadioButton.Group>
  );

  return (
    <View style={styles.container}>
      <View style={styles.questionWrapper}>
        <Text style={[styles.questionCount, { color: theme.colors.primary }]}>
          Question {questionNumber}
        </Text>
        <Text variant="titleMedium" style={styles.questionDesc}>
          {question}
        </Text>
      </View>
      {QuestionContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  questionWrapper: {
    marginBottom: 16,
    rowGap: 8,
  },
  questionDesc: {
    fontWeight: "bold",
  },
  answerOption: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "darkgray",
  },
});
