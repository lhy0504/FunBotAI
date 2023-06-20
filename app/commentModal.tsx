import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useSearchParams } from 'expo-router';

export default function ModalScreen() {
  const { comments=[],callback } = useSearchParams();
  console.log(Object.keys(useSearchParams().comments))
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
     
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

       {/* comments */}
       {comments&& comments.map(commentItem => (
        <View style={{ flexDirection: 'row', marginBottom: 4, marginLeft: 15 }}>
          <Text style={{ marginLeft: 5, fontWeight: '800' }}>{commentItem.username}</Text>
          <Text style={{ marginLeft: 5 }} >{commentItem.comment}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
