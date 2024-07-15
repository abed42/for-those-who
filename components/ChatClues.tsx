import { View, Text, StyleSheet } from "react-native";
import ChatMessage from "./ChatMessage";
import { MessageType } from "./AssistantChat";

export default function ChatClues({ clues }: { clues: MessageType[] }) {
  return (
    <View style={styles.layout}>
      <Text style={styles.title}>{clues.length} clues to be added</Text>
      {clues.map((clue) => (
        <ChatMessage key={clue.id} role={"assistant"} message={clue.message} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#D9EBFF",
  },
  title: {
    fontWeight: "bold",
  },
});
