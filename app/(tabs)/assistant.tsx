import Action from "@/components/Action";
import Clue from "@/components/Clue";
import { View, Text, StyleSheet, Image } from "react-native";

const Assistant = () => {
  return (
    <View style={styles.layout}>
      <View style={styles.assistant}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Image
            source={require("@/assets/images/ftw-blue.png")}
            style={styles.assistantIcon}
          />
          <View style={{ flex: 1 }}>
            <Text>
              Hey there! I’m your AI assistant, ready to help you get the most
              relevant content.
            </Text>
            <View style={{ padding: 5 }} />
            <Text>How can I assist you today?</Text>
            <View style={{ padding: 8 }} />
            <View style={styles.actions}>
              <Action>I hate some sources</Action>
              <Action>I want to change some of my clues</Action>
              <Action>I want to read more about</Action>
              <Action>I want to share something new about me</Action>
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 16 }} />
      <View>
        <Text>Here are the clues you've given us</Text>
        <View style={{ padding: 8 }} />
        <View style={styles.clues}>
          <Clue>
            At work, I develop artificial intelligence systems for enterprise
            conversational agents
          </Clue>
          <Clue>
            On the side, I am learning about game development using Rust, with a
            focus on GPU programming
          </Clue>
          <Clue>
            I  am currently looking into wedding planning for my wedding in
            Athens, Greece on August 8th
          </Clue>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    padding: 16,
    flex: 1,
    backgroundColor: "white",
  },
  assistant: {
    width: "100%",
    backgroundColor: "#F5FAFF",
    padding: 18,
    borderRadius: 12,
  },
  assistantIcon: {
    height: 24,
    width: 24,
    marginRight: 8,
  },
  actions: {
    display: "flex",
    gap: 5,
  },
  clues: {
    display: "flex",
    gap: 5,
  },
});

export default Assistant;
