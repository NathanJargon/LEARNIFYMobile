import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton, Text } from "react-native-paper";

export default function QuestionCard({ questionNumber, question, choices, onAnswerSelect }) {
  const [answer, setAnswer] = useState("first");

  useEffect(() => {
    // Call the onAnswerSelect function whenever the answer state changes
    onAnswerSelect(answer);
  }, [answer]);

  const QuestionContent = (
    <RadioButton.Group
      onValueChange={(newAnswer) => setAnswer(newAnswer)}
      value={answer}
    >
    {choices?.map((option, index) => {
      return (
        <React.Fragment key={index}>
          <RadioButton.Item
            style={styles.answerOption}
            label={option} // use option directly instead of option.choice
            value={option} // use option directly instead of option.choice
          />
          <View style={{ height: 14 }} />
        </React.Fragment>
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
