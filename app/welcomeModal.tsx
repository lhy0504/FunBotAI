import { Alert, Image, Platform, StyleSheet, TouchableOpacity, TextInput, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Button, Chip, } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_HINTS = [
  { display: 'Cat...', fulltext: 'Cat' },
  { display: 'Dog...', fulltext: 'Dog' },
  { display: 'Henry...', fulltext: 'Henry' },
]
const DEFAULT_PROMPT = 'Cat eating pizza on sofa'
const MAX_CHAR = 100

export default function TabTwoScreen() {
  const router = useRouter();

  function accept() {
    
      try {
         AsyncStorage.setItem('@funbot/terms', 'ok')
      } catch (e) {
        // saving error
      }
      router.replace("/")
    
  }
  return (

    <View key={20} style={{
      flex: 1,
      alignItems: 'center', justifyContent: 'center',
      paddingVertical: 10,
      backgroundColor: 'purple', overflow: 'hidden',

    }}>

      <Text style={{ margin: 20, fontWeight: '400', fontSize: 24 }} lightColor='#bbb'>
        <Image source={require('./../assets/images/symbol.png')} style={{ width: 20, height: 20 }} />{' FunBot AI'}</Text>

      


        {/* right */}

        <TouchableOpacity onPress={() => Linking.openURL('https://lhy0504.github.io/FunBotAI_terms.html')} >
          <Text lightColor='lightblue' style={{ padding: 20 }}>Read our Terms</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={accept} >
          <Button
            icon="chevron-right" buttonColor='darkcyan'
            mode="contained"
          >Accept Terms</Button>
        </TouchableOpacity>


     

    </View>

  );
}
