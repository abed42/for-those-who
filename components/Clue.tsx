import { View, Text, StyleSheet } from "react-native";

type ClueType = {
  children: React.ReactNode;
};

export default function Clue({ children }: ClueType) {
  return (
    <View style={styles.layout}>
      <Text>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 12,
    backgroundColor: "#F9F7F7",
    borderRadius: 10,
    alignSelf: "flex-start",
  },
});
