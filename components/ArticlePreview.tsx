import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Svg, { Path } from "react-native-svg";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const LinkSvg = () => {
  return (
    <Svg style={styles.linkSvg} viewBox="0 0 640 512">
      <Path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
    </Svg>
  );
};

type ArticlePreviewType = {
  article: any;
};

export default function ArticlePreview({ article }: ArticlePreviewType) {
  article = {
    id: "e407fbb5-799c-4c53-af95-2ea2cd22fd1f",
    content:
      'Hello, I want to learn Playwright and Cucumber, so I started with this tutorial https://talent500.co/blog/how-to-integrate-cucumber-with-playwright/ I followed all the steps, but I still get this error when I try to run the tests. UUUUUU Failures: 1) Scenario: Login Functionality # tests\\features\\login.feature:3 ...steps desciption 1 scenario (1 undefined) 6 steps (6 undefined)  The structure is this: playwright_talent500/ │ ├── features/ │ └── login.feature │ └── steps/ └── login.js  package.json { "name": "cucumber", "version": "1.0.0", "main": "index.js", "scripts": { "test": "cucumber-js test" }, "keywords": [], "author": "", "license": "ISC", "description": "", "devDependencies": { "@cucumber/cucumber": "^10.8.0", "@playwright/test": "^1.45.3", "@types/node": "^20.14.12" } }  login.feature Feature: Login Functionality Scenario: Login Functionality Given User navigates to the application When I enter the username as "email" When I enter the password as "password" When I click on login button Then User should logged in successfully Then Logout from the application  I tried to solve this with chat GPT, I followed all the steps but nothing... can someone please help me?    submitted by    /u/Icy-Purple-1814   [link]   [comments]',
    createdAt: "2024-07-26T11:57:48.686Z",
    updatedAt: "2024-07-26T11:57:48.686Z",
    link: "https://www.reddit.com/r/QualityAssurance/comments/1ecm1hs/1_scenario_1_undefined_6_steps_6_undefined/",
    title: "1 scenario (1 undefined) 6 steps (6 undefined)",
    imageUrl:
      "https://cdn.analyticsvidhya.com/wp-content/uploads/2024/07/Index-in-Sql-80.jpg",
    Source: {
      id: "941a50be-f320-4071-b4e9-194fe8c06e78",
      name: "Twitter",
      sourceId: "feed/https://www.reddit.com/r/QualityAssurance/.rss",
      isFirstScoring: null,
      isFirstMatching: null,
      createdAt: "2024-06-26T06:42:31.359Z",
      updatedAt: "2024-06-26T06:42:31.359Z",
      sourceGroupId: null,
    },
  };

  const handlePressButtonAsync = async () => {
    await WebBrowser.openBrowserAsync(article.link);
  };

  return (
    <View style={[styles.layout]}>
      <View style={[styles.head]}>
        <Text style={styles.title} numberOfLines={4}>
          {article.title}
        </Text>
        {article.imageUrl && (
          <Image
            style={styles.image}
            source={{
              uri: article.imageUrl,
            }}
          />
        )}
      </View>
      <View>
        <View style={[styles.actions]}>
          {article.Source?.name && (
            <TouchableOpacity
              style={styles.link}
              onPress={handlePressButtonAsync}
            >
              <LinkSvg />
              <Text style={styles.linkText}>{article.Source?.name}</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.action]}>•</Text>
          <FontAwesome5 name="glasses" size={12} color="#979BB1" />
          <Text style={[styles.action]}>5 min read</Text>
          <Text style={[styles.action]}>•</Text>
          <Text style={[styles.action]}>
            based on <Text style={[styles.italics]}>2 clues</Text>
          </Text>
          <View></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    padding: 16,
    backgroundColor: "#F9F7F7",
    borderRadius: 20,
    marginBottom: 12,
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  title: {
    fontFamily: "SourseSerif4",
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
  },
  image: {
    width: 80,
    height: "auto",
  },
  link: {
    width: "auto",
    backgroundColor: "#F5FAFF",
    padding: 8,
    borderRadius: 30,
    alignSelf: "flex-start",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#0029FF",
    fontWeight: "bold",
  },
  linkSvg: {
    //@ts-ignore
    fill: "#0029FF",
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  action: {
    color: "#979BB1",
  },
  italics: {
    textDecorationLine: "underline",
  },
});
