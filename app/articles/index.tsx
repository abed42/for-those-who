import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { ActivityIndicator, FlatList, Text, View } from "react-native";

const Articles = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const token = "d33f1a6621f17e8090f8fb9c1b6b6f01";
  const userId = "1efd9ff3-1fdb-4ea7-9ce1-bacaadbaed65";

  const getArticles = async () => {
    try {
      const response = await fetch(
        `https://staging.forthosewho.com/v2/users/${userId}/articles`,
        {
          headers: new Headers({
            Authorization: "Bearer " + token,
          }),
        }
      );
      const json = await response.json();
      setData(json.rows);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.layout}>
        <Text style={styles.stories}>Stories for you</Text>
        <Text style={styles.subHead}>Picked based on the clues you shared</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }) => id}
            renderItem={({ item }) => (
              <View>
                <Article article={item} />
                <View style={styles.separator}></View>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  layout: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  stories: {
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 30,
  },
  subHead: {
    fontSize: 18,
    marginBottom: 30,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
    backgroundColor: "#F9F7F7",
  },
});

export default Articles;
