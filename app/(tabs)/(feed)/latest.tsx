import { Dimensions, FlatList, RefreshControl, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from "expo-router";
import { Text, View } from '../../../components/Themed';
import { FontAwesome, Fontisto, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import PostView from '../../../components/PostView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../../constants/Colors';
const sampleData = [
  {
    title: "Cat", username: 'heisiyau', date: '4h', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9zEI-wg4I1HKv5klnE1DWOndggK1ZY6e3PKTgTr06_A&s',
    likes: 25, comments: [
      { username: 'hi123', comment: 'stupid cat' },
      { username: 'xxyzh005631', comment: 'from china' }
    ]
  },
  {
    title: 'Dog eating pizza', username: 'osushddd', date: '1d', url: 'https://i.chzbgr.com/full/4203747584/h65B5C853/anyone',
    likes: 20, comments: [
      { username: 'hi123', comment: 'stupid cat' },
      { username: 'xxyzh005631', comment: 'from china' }
    ]
  }
]

export default function TabOneScreen() {
  var device = Dimensions.get('window');

  const router = useRouter();
  const [posts, setPosts] = useState([])
  const [lastLoadedNegdate, setlastLoadedNegdate] = useState(-9999999999999)
  const [refreshing, setRefreshing] = useState(false)
  const [filterProperty, setFilterProperty] = useState('negdate')

  useEffect(() => {
    getPosts()
  }, []);

  const getPosts = async (startAfter = undefined) => {
    // get ban list
    let blocklist: string[] = []
    const value = await AsyncStorage.getItem('@funbot/block')
    if (value != null) blocklist = JSON.parse(value)
    let currentMode = filterProperty

    // get posts
    if (!startAfter) startAfter = lastLoadedNegdate
    let uri = 'https://rntest-47f77.web.app/api/feed?orderBy=' + filterProperty + '&start=' + lastLoadedNegdate
    fetch(uri, {
      method: 'get', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
      .then(r => {
        /* check if  */
        let filtered = r.result.filter(i => { return !blocklist.includes(i.username) })
        setPosts([...posts, ...(filtered)])
        setlastLoadedNegdate(r.result[r.result.length - 1][filterProperty])
        setRefreshing(false)
      })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setlastLoadedNegdate(-9999999999999)
    setPosts([])
    getPosts(-9999999999999)
  }
  const colorScheme = useColorScheme();
  return (
  

     <FlatList
        keyboardShouldPersistTaps='always'
        style={{ backgroundColor: colorScheme == 'dark' ? '#222' : '#eee', flex: 1 }}
        data={posts}
        onEndReached={getPosts}
        renderItem={({ item }) => <PostView post={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        /*  ListEmptyComponent={<View style={{ flex: 1, margin: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)' }}>
           <ActivityIndicator /></View>}*/
        ListFooterComponent={<View style={{ flex: 1, margin: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0)' }}>
          <ActivityIndicator /></View>}
       /*  ListHeaderComponent={() => (
          <TouchableOpacity activeOpacity={.7} onPress={() => router.push("/")}>

            <View style={{
              paddingVertical: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
              backgroundColor: 'purple', overflow: 'hidden', width: device.width
            }}>
              <Text style={{ marginLeft: 15, fontWeight: '800', fontSize: 25 }} lightColor='white'>{'Generate your image ›'}</Text>

              <View style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0)' }}>
                <Ionicons name="md-add-circle-sharp" size={38} color="darkcyan" />
                <Text style={{ margin: 5, padding: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.2)', overflow: 'hidden', flex: 1 }}
                  lightColor='#aaa'>
                  {" > Cat eating pizza on sofa"}
                </Text>
              </View>
            </View>

          </TouchableOpacity>
        )
        } */
      />



  );
}
