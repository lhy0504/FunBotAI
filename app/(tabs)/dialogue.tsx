import { Alert, Image, Platform, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Chip, } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function TabTwoScreen() {
  const [requestText, setRequest] = useState('')
  const [isGenerating, setGenerating] = useState(false)
  const [isLoadingPrompt, setLoadingPrompt] = useState(false)
  const textRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // first time
    updateHints()

  }, []);

  const getImage = async () => {

    setGenerating(true)

    let arr = requestText.split('\n')
    let finalRequestText = arr[arr.length-1]
    console.log(finalRequestText)

    fetch('https://rntest-47f77.web.app/api/generate_img', {
      method: 'post', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "animal": finalRequestText,
      }),
    }).then(res => res.json())
      .then(url => {
        let u = url.result
        console.log(url)
        if (!u) throw new Error('no result')

        // cache if android; not working in ios
        if (Platform.OS == 'ios') {
          router.push('/imgResultModal?url=' + encodeURIComponent(u) + '&prompt=' + encodeURIComponent(requestText))
          setGenerating(false)
          return
        }
        var temp = Image.prefetch(u)
          .then((data) => data)
          .finally(() => {
            router.push('/imgResultModal?url=' + encodeURIComponent(u) + '&prompt=' + encodeURIComponent(requestText))
            setGenerating(false)
          })
      })
      .catch(e => {
        // error showing.
        setGenerating(false)
        Alert.alert('Opps', 'Something went wrong! It may be caused by network problem.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);

      })

  }
  const updateHints = () => {

    setRequest('')
    setLoadingPrompt(true)
    fetch('https://rntest-47f77.web.app/api/dialogue', {
      method: 'post', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        setRequest(res.choices[0].text.trim())
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => setLoadingPrompt(false))

  }

  return (

    <ScrollView key={20} keyboardShouldPersistTaps='handled'
      style={{
        flex: 1, backgroundColor: 'white',
        overflow: 'hidden',

      }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: 'darkcyan' }}>
        <Text style={{ margin: 20, fontWeight: '400', fontSize: 24 }} lightColor='#eee' >
          {'Dialogue Generator'}</Text>


      </SafeAreaView>
      <View style={{
        marginHorizontal: 20, marginTop: 20, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0)'
      }}>
        <Text style={{ fontWeight: '200' }} >{'ENTER DIALOGUE ›'}</Text>
        <TouchableOpacity onPress={() => { setRequest(''); }}>
          <Text >CLEAR</Text>
        </TouchableOpacity>
      </View>
      <View key={21} style={{
        marginHorizontal: 15, flexDirection: 'row',
        borderRadius: 40, margin: 5, backgroundColor: 'rgba(255,255,255,.25)', borderWidth: 3, borderColor: '#888'
      }}>

        <TextInput key={53} value={requestText} ref={textRef} multiline={true} placeholderTextColor={'#aaa'} underlineColorAndroid="transparent"
          onChangeText={(text) => { setRequest(text); console.log(text) }} placeholder='Loading...'
          style={{
            marginVertical: 10, padding: 20, backgroundColor: 'rgba(0,0,0,0)', textAlignVertical: 'top',
            overflow: 'hidden', flex: 1, fontWeight: '500', fontSize: 17, minHeight: 100

          }}
        />

      </View>
      <View key={22} style={{
        marginHorizontal: 20, height: 50, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0)'
      }}>

        {isLoadingPrompt ?
          <ActivityIndicator size={'small'} animating={true} />
          :

          <TouchableOpacity onPress={updateHints}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name='refresh' size={40} color='#aaa' />
              <Text lightColor='#aaa'>{'REGENERATE'}</Text>


            </View>
          </TouchableOpacity>
        }
        {isGenerating ?
          <ActivityIndicator size={'small'} animating={true} />
          :
          <TouchableOpacity onPress={getImage} >
            {/* <MaterialCommunityIcons name="send-circle" size={50} color="darkcyan" /> */}
            <Button
              icon="send" buttonColor='darkcyan'
              mode="contained"

            >Generate Image</Button>
          </TouchableOpacity>
        }
      </View>

    </ScrollView>

  );
}
