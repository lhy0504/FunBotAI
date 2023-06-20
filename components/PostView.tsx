import React, { useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Dialog from "react-native-dialog";
import * as Sharing from 'expo-sharing';
import { Text, View } from './Themed';
import { Entypo, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import moment from 'moment';
import { properDate } from '../api/util';
import { ImageView } from './ImageView';
import { useRouter } from 'expo-router';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';

const emptyPost = {
  title: "", username: '', date: '', url: '',
  likes: 0, comments: [

  ]
}
export default function PostView(props: any) {
  var device = Dimensions.get('window');
  const [item, setItem] = useState(props.post)
  const [comments, setComments] = useState(props.post.comments) // need separate for update in modal.
  const [commentModalStage, setCommentmodalStage] = useState(0)
  const [pendingComment, setPendingComment] = useState('')
  const [commentUsername, setCommentUsername] = useState('')
  const viewShot = useRef();

  const like = () => {
    let uri = 'https://rntest-47f77.web.app/api/like?id=' + item.id
    fetch(uri, {
      method: 'get', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    })
    setItem({
      ...item,
      likes: item.likes + 1
    })
  }
  const comment = () => {
    setCommentmodalStage(1)
  }
  const submitComment = () => {
    setCommentmodalStage(0)
    let uri = 'https://rntest-47f77.web.app/api/comment?id=' + item.id +
      "&comment=" + encodeURIComponent(pendingComment) +
      "&username=" + encodeURIComponent(commentUsername)
    fetch(uri, {
      method: 'get', mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    })
    setComments(
      [...item.comments, { comment: pendingComment, username: commentUsername }]
    )
  }
  const shareExt = () => {
    viewShot.current.capture().then((uri: string) => {
      console.log("do something with ", uri);
      Sharing.shareAsync("file://" + uri.replace("file://", ''));
    }),
      (error) => console.error("Oops, snapshot failed", error);
  }
  const report = () => {
    Alert.alert(
      'Report as inappropriate content?',
      'This will also block all posts from this author.',
      [
        {
          text: 'Yes', onPress: doBlock,
        },
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ]
    );
  }
  const doBlock=async() => {
    Alert.alert("Sorry. We'll review the post shortly.", "You will no longer see posts from this author.")
    setItem(emptyPost)

    let blocklist =[]
    const value = await AsyncStorage.getItem('@funbot/block')
    if (value != null) blocklist = JSON.parse(value)
    blocklist.push(item.username)
    console.log(blocklist)
    await AsyncStorage.setItem('@funbot/block',JSON.stringify( blocklist))

  
}
  return (
    <ViewShot
      ref={viewShot}
    >
      <View style={{ marginTop: 15, paddingVertical: 10, borderRadius: 20, overflow: 'hidden' }} >
        <View style={{ margin: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="person-circle-sharp" size={24} color="black" />
            <Text style={{ marginLeft: 5 }}>{item.username}</Text>
            <Text style={{ marginLeft: 5 }} lightColor='#999' darkColor='#999'>{' ' + moment(properDate(item.date)).fromNow()}</Text>
          </View>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={report}>
            <Entypo name="dots-three-horizontal" size={16} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={{ margin: 15, marginTop: 0, fontWeight: '800' }}>{'› ' + item.title}</Text>
        <ImageView width={device.width} height={device.width} src={item.url} />
        {/* toolbar */}
        <View style={{ paddingLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }} onPress={like}>
            <SimpleLineIcons name="like" size={20} color="black" />
            <Text style={{ marginLeft: 5, marginRight: 15, fontWeight: '800' }}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 15, flexDirection: 'row', alignItems: 'center' }} onPress={comment}>
            <FontAwesome name="comment-o" size={22} color="black" />
            <Text style={{ marginLeft: 5, marginRight: 15, fontWeight: '800' }}>{comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 15, flexDirection: 'row', alignItems: 'center' }} onPress={shareExt}>
            <FontAwesome name="send-o" size={22} color="black" />
          </TouchableOpacity>
        </View>
        {/* comments */}
        {comments.map(commentItem => (
          <View style={{ flexDirection: 'row', marginBottom: 4, marginLeft: 15 }}>
            <Text style={{ marginLeft: 5, fontWeight: '800' }}>{commentItem.username}</Text>
            <Text style={{ marginLeft: 5 }} >{commentItem.comment}</Text>
          </View>
        ))}

        {/* comment modal */}
        <Dialog.Container visible={commentModalStage == 1}>
          <Dialog.Title>Add a comment</Dialog.Title>
          <Dialog.Input value={pendingComment} onChangeText={setPendingComment} />
          <Dialog.Button label="Cancel" onPress={() => setCommentmodalStage(0)} />
          <Dialog.Button label="Submit" onPress={() => { // fox ios bug
            setCommentmodalStage(0)
            setTimeout(() => {
              setCommentmodalStage(2)
            }, 600);

          }} />
        </Dialog.Container>
        {/* enter name modal */}
        <Dialog.Container visible={commentModalStage == 2}>
          <Dialog.Title>Enter your name</Dialog.Title>
          <Dialog.Description>{pendingComment}</Dialog.Description>
          <Dialog.Input value={commentUsername} onChangeText={setCommentUsername} />
          <Dialog.Button label="Cancel" onPress={() => setCommentmodalStage(0)} />
          <Dialog.Button label="Submit" onPress={submitComment} />
        </Dialog.Container>
      </View>
    </ViewShot>
  );
}
