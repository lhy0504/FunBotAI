import ViewShot from "react-native-view-shot";
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { Text, View } from '../components/Themed';
import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { ImageView } from '../components/ImageView';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";


export default function ModalScreen() {

  let { url, prompt }: { url: string, prompt: string } = useLocalSearchParams() as { url: string, prompt: string };
  const [realModalWidth,setRealModalWidth]=useState(Dimensions.get('window').width)
  const router = useRouter();
  const [willShare, setWillShare] = useState(0)
  const [username, setUsername] = useState('')
  const textRef = useRef(null);
  const viewShot = useRef();

  const startShare = () => {
    setWillShare(1)
    textRef?.current?.focus();
  }
  const share = () => {
    setWillShare(2)
    // to server
    fetch('https://rntest-47f77.web.app/api/upload', {
      method: 'post', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        username: username,
        title: prompt
      }),
    })//.then(res=>res.text()).then(r=>console.log(r))
  }
  const shareExt = () => {
    viewShot.current.capture().then((uri: string) => {
      console.log("do something with ", uri);
      Sharing.shareAsync("file://" + uri.replace("file://", ''));
    }),
      (error) => console.error("Oops, snapshot failed", error);
  }
  const save = async () => {
    let localuri = await viewShot.current.capture()
    await MediaLibrary.requestPermissionsAsync();
    await MediaLibrary.saveToLibraryAsync("file://" + localuri)
    Alert.alert('Image Saved');
  }
  const onlayout=(evt)=>{
    setRealModalWidth(evt.nativeEvent.layout.width)
  }

  return (
    <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='always' onLayout={onlayout}>
      <ViewShot
        ref={viewShot}
        style={{
          flex: 1, backgroundColor: 'white'
        }}>
        <Text style={{ margin: 15, marginTop: 10, fontWeight: '800', fontSize: 20, textAlign: 'center' }}>{'› ' + prompt}</Text>
        <ImageView
          src={url}
          width={realModalWidth}
          height={realModalWidth} />
        {willShare == 2 &&
          <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', }}>
              <Ionicons name="person-circle-sharp" size={24} color="black" />
              <Text style={{ paddingLeft: 5 }}>{username}</Text>
            </View>
            <Text style={{ fontWeight: '400' }} lightColor='#bbb'>
              {'FunBot AI'}
            </Text>
          </View>}
      </ViewShot>
      <View style={{ height: 200, width: '100%', paddingHorizontal: 20, alignItems: 'center' }}>
        {willShare == 2 ?
          <><Button style={{ marginTop: 20, width: '100%' }}
            icon="share" onPress={shareExt}
            mode="contained"
          >Share External</Button>
            <Button style={{ marginTop: 20, width: '100%' }}
              icon="download" onPress={save}
              mode="contained"
            >Save</Button>
            <Button style={{ marginTop: 20, width: '100%' }}
              icon="cancel" buttonColor='grey'
              mode="contained"
              onPress={() => router.back()}
            >Close</Button>
          </>

          : (willShare == 1 ?
            <View style={{
              marginVertical: 15, flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'rgba(0,0,0,0)',
              justifyContent: 'space-between'
            }}>
              <TextInput value={username} ref={textRef}
                placeholder={'Enter your name...'} placeholderTextColor={'#aaa'}
                onChangeText={(text) => setUsername(text)}
                style={{
                  margin: 5, flex: 1, backgroundColor: '#eee', textAlign: 'center'
                }} />

              <TouchableOpacity activeOpacity={.7} onPress={share}>
                <MaterialCommunityIcons name="send-circle" size={50} color="darkcyan" />
              </TouchableOpacity>
            </View>
            :
            <><Button style={{ marginTop: 20, width: '100%' }}
              icon="share"
              mode="contained" onPress={startShare}
            >Share</Button>
              <Button style={{ marginTop: 20, width: '100%' }}
                icon="cancel" buttonColor='crimson'
                mode="contained"
                onPress={() => router.back()}
              >Discard</Button></>
          )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
    /*  alignItems: 'center',
     justifyContent: 'center', */,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
