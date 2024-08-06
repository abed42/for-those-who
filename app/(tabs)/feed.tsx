import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Checkbox from "expo-checkbox";

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import fetchWrapper from "@/utils/fetchWrapper";
import { FontAwesome5 } from "@expo/vector-icons";
import Popover from "react-native-popover-view";

type ArticleResponseType = {
  count: number;
  rows: ArticleExtendedModel[];
};

const Feed = () => {
  const PER_PAGE = 10;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ArticleExtendedModel[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const filters = [
    { key: "relevant", name: "Relevant" },
    { key: "veryRelevant", name: "Very Relevant" },
  ];
  const [selected, setSelected] = useState(["Relevant", "Very Relevant"]);
  const [refreshing, setRefreshing] = useState(false);

  const getArticles = async () => {
    const token = await SecureStore.getItemAsync("token");
    const userId = await SecureStore.getItemAsync("userId");

    try {
      const response: ArticleResponseType = await fetchWrapper(
        `/users/${userId}/articles?offset=${offset}&limit=${PER_PAGE}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      setData((prevData) => [...prevData, ...response.rows]);

      // Then, in your JSX, simply use `data` as before
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setOffset(0);
    setData([]);
    setRefreshing(true);
    await getArticles();
    setRefreshing(false);
  };
  // fetch articles at the end of the list
  useEffect(() => {
    if (!refreshing) {
      getArticles();
    }
  }, [offset]);

  return (
    <SafeAreaView style={styles.layout}>
      {isLoading ? (
        <ActivityIndicator style={styles.footer} />
      ) : (
        <FlatList
          ListHeaderComponent={
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <Text style={styles.stories}>Stories for you</Text>
                <Text style={styles.subHead}>
                  Picked based on the clues you shared
                </Text>
              </View>
              <View style={styles.filterContainer}>
                <Popover
                  from={
                    <TouchableOpacity style={styles.filter}>
                      <FontAwesome5 name="filter" size={12} color="#0129FF" />
                      <View style={styles.badge}>
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {selected.length}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }
                >
                  <View>
                    {filters.map((filter) => (
                      <View key={filter.key} style={styles.filterItem}>
                        <Checkbox
                          value={selected.includes(filter.name)}
                          color={
                            selected.includes(filter.name)
                              ? "#0129FF"
                              : undefined
                          }
                          onValueChange={(checked) => {
                            if (checked) {
                              if (!selected.includes(filter.name)) {
                                setSelected((prevSelected) => [
                                  ...prevSelected,
                                  filter.name,
                                ]);
                              }
                            } else {
                              setSelected((prevSelected) =>
                                prevSelected.filter(
                                  (item) => item !== filter.name
                                )
                              );
                            }
                          }}
                        ></Checkbox>
                        <Text style={styles.filterText}>{filter.name}</Text>
                      </View>
                    ))}
                  </View>
                </Popover>
              </View>
            </View>
          }
          data={data}
          keyExtractor={({ ArticleId }) => ArticleId}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={() => setOffset((offset: number) => offset + PER_PAGE)}
          onEndReachedThreshold={0.8}
          ListFooterComponent={refreshing ? <> </> : <ActivityIndicator />}
          renderItem={({ item }) => (
            <View>
              {selected.includes(item.Article.rating) && (
                <>
                  <Article article={item} />
                  <View style={styles.separator}></View>
                </>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
  },
  header: {
    flex: 1,
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
  popover: {
    marginTop: 10,
    shadowRadius: 4,
  },
  badge: {
    height: 16,
    width: 16,
    backgroundColor: "red",
    position: "absolute",
    right: -8,
    top: -8,
    borderRadius: 33,
    display: "flex",
    alignItems: "center",
  },
  filterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  filter: {
    borderWidth: 2,
    display: "flex",
    alignItems: "center",
    padding: 8,
    borderColor: "#F9F7F7",
    borderRadius: 50,
    marginBottom: 20,
    marginRight: 18,
    backgroundColor: "#F5FAFE",
  },
  filterItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  filterText: {
    marginLeft: 8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
    backgroundColor: "#F9F7F7",
  },
  footer: {
    marginTop: 42,
  },
});

export default Feed;
