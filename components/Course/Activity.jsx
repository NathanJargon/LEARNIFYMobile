import { FlatList, View, Text } from "react-native";
import { StyleSheet } from "react-native";

import ActivityCard from "./ActivityCard";

export default function Activity({ activities }) {

  const activityCards = !activities ? (
    <Text style={{ color: theme.colors.secondary }}>No Activity</Text>
  ) : (
    activities.map((activity) => {
      const title = activity.activityName || "Activity";  // Changed this line
      const id = activity.userId;  // Changed this line

      return <ActivityCard key={id} title={title} id={id} />;
    })
  );

  return <View style={styles.container}>{activityCards}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  body: {
    flex: 1,
  },
});