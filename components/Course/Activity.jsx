import { FlatList, View, Text } from "react-native";
import { StyleSheet } from "react-native";

import ActivityCard from "./ActivityCard";

export default function Activity({ activities }) {

  const activityCards = !activities ? (
    <Text style={{ color: theme.colors.secondary }}>No Activity</Text>
  ) : (
    activities.map((activity) => {
      let title = activity.activityName || "Activity";
      let id = activity.userId;

      // Convert %20 back to spaces in title and id
      title = title.replace(/%20/g, ' ');
      id = id.replace(/%20/g, ' ');

      console.log("Activity userId: " + activity.userId);
      console.log(title);
      console.log(id);

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