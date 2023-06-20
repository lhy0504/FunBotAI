import { Alert, Image, Platform, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Chip, } from 'react-native-paper';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_HINTS = [
  { display: 'Cat...', fulltext: 'Cat' },
  { display: 'Dog...', fulltext: 'Dog' },
  { display: 'Henry...', fulltext: 'Henry' },
]
const DEFAULT_PROMPT = 'Cat eating pizza on sofa'
const MAX_CHAR = 1000

export default function TabTwoScreen() {
  const [requestText, setRequest] = useState('')
  const [isGenerating, setGenerating] = useState(false)
  const [lastPrompt, setLastPrompt] = useState('')
  const [isLoadingPrompt, setLoadingPrompt] = useState(false)
  const [hints, setHints] = useState(DEFAULT_HINTS)
  const textRef = useRef(null);
  const router = useRouter();

  /* useFocusEffect(
    useCallback(() => {
      // When the screen is focused
      const focus = () => {
        setTimeout(() => {
          textRef?.current?.focus();
        }, 1);
      };
      focus();
      return focus; // cleanup
    }, []),
  ); */
  useEffect(() => {
    // first time
    checkTerms();
    setFirstHints()

  }, [textRef]);

  function setFirstHints() {
    setLoadingPrompt(true)
    fetch('https://rntest-47f77.web.app/api/memetopic', {
      method: 'post', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
      .then(res => {
        setHints(res.choices.map((i) => ({
          display: i.text.replaceAll("\n", '').replaceAll("\"", ''),
          fulltext: i.text.replaceAll("\n", '').replaceAll("\"", '')
        })))
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => setLoadingPrompt(false))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateHints()
    }, 1500);
    return () => clearInterval(interval);
  }, [requestText, lastPrompt]);

  async function checkTerms() {
    try {
      const value = await AsyncStorage.getItem('@funbot/terms')
      if (value == null) router.push('/welcomeModal')
    } catch (e) {
      router.push('/welcomeModal')

    }
  }
  const getImage = async () => {

    setGenerating(true)
    let finalRequestText = requestText == '' ? DEFAULT_PROMPT : requestText

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
          router.push('/imgResultModal?url=' + encodeURIComponent(u) + '&prompt=' + encodeURIComponent(finalRequestText))
          setGenerating(false)
          return
        }
        var temp = Image.prefetch(u)
          .then((data) => data)
          .finally(() => {
            router.push('/imgResultModal?url=' + encodeURIComponent(u) + '&prompt=' + encodeURIComponent(finalRequestText))
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
  const updateHints = (force = false) => {
    if (requestText == '' && lastPrompt != '') {
      setLastPrompt('')
      setFirstHints()
      return
    }
    if (requestText.trim().valueOf() === lastPrompt.trim().valueOf() && !force) return
    setLastPrompt(requestText.valueOf())
    setLoadingPrompt(true)
    console.log('enter')

    fetch('https://rntest-47f77.web.app/api/completion', {
      method: 'post', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "prompt": requestText,
      }),
    }).then(res => res.json())
      .then(res => {
        setHints(res.choices.map((i) => ({ display: '...' + i.text, fulltext: requestText + i.text })))
      })
      .catch(e => {
        console.log(e)
      })
      .finally(() => setLoadingPrompt(false))

  }
  const onHintSelected = (i) => {
    if (MAX_CHAR < i.fulltext.length) return
    setRequest(i.fulltext);
    setLoadingPrompt(true)
  }
  return (

    <ScrollView key={20} keyboardShouldPersistTaps='handled'
      style={{
        flex: 1,
        backgroundColor: 'white', overflow: 'hidden',

      }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: 'purple' }}>
        <Text style={{ margin: 20, fontWeight: '400', fontSize: 24 }} lightColor='#bbb'>
          <Image source={require('./../../assets/images/symbol.png')} style={{ width: 20, height: 20 }} />{' Meme Generator'}</Text>


      </SafeAreaView>
      <View style={{
        marginHorizontal: 20, marginTop: 20, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0)'
      }}>
        <Text style={{ fontWeight: '200' }}>{'ENTER PROMPT ›'}</Text>
        <TouchableOpacity onPress={() => { setRequest(''); setLoadingPrompt(true) }}>
          <Text lightColor='#aaa'>CLEAR</Text>
        </TouchableOpacity>
      </View>
      <View key={21} style={{
        marginHorizontal: 15, flexDirection: 'row',
        borderRadius: 40, margin: 5, backgroundColor: 'rgba(255,255,255,.25)', borderWidth: 3, borderColor: '#888'
      }}>

        <TextInput key={53} value={requestText} ref={textRef} multiline={true}
          placeholder={DEFAULT_PROMPT} placeholderTextColor={'#aaa'} underlineColorAndroid="transparent"
          onChangeText={(text) => { setRequest(text); console.log(text) }} maxLength={MAX_CHAR}
          style={{
            marginVertical: 10, padding: 20, backgroundColor: 'rgba(0,0,0,0)',  textAlignVertical: 'top',
            overflow: 'hidden', flex: 1, fontWeight: '500', fontSize: 17, minHeight: 100

          }}
        />

      </View>
      <View key={22} style={{
        marginHorizontal: 20, height: 50, alignItems: 'center',
        flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0)'
      }}>
        {/* left */}
        <View key={54} style={{ backgroundColor: 'rgba(0,0,0,0)', flex: 1, marginRight: 20 }}>
          <Text lightColor='#aaa'>{"Characters: " + requestText.length + "/" + MAX_CHAR}</Text>
        </View>

        {/* right */}
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
      {/* Chips */}
      <View key={23} style={{
         marginHorizontal: 20, marginTop: 15, flexWrap: 'wrap', 
      }}>
        {isLoadingPrompt ?
          <View style={{ backgroundColor: 'rgba(0,0,0,0)', width: '100%', alignItems: 'center', marginTop: 20 }}>
            <ActivityIndicator size={'large'} animating={true} /></View>
          :
          hints.map((i, index) => (
            <TouchableOpacity activeOpacity={.8} onPress={() => onHintSelected(i)} style={{ width: '100%' }}>
              <Text key={index}
                style={{
                  marginRight: 5, marginBottom: 5, flexWrap: 'wrap', borderRadius: 10, backgroundColor: '#eee', overflow: 'hidden',
                  padding: 15, paddingHorizontal: 20, width: '100%', fontSize: 16, fontWeight: '500'
                }} >{i.display}</Text>
            </TouchableOpacity>
          ))}

      </View>

    </ScrollView>

  );
}
