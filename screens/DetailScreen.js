

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

export default class DetailScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      item: this.props.navigation.getParam('data'),
      comments: [],
      name: "",
      nd: "",
    }
  }
  static navigationOptions = {
    title: 'Bài Viết',
  };
  componentDidMount = () => {
    
    this.getCommentPosts(this.state.item.key);
  }
  getCommentPosts(keyPost){
    var that = this;
    firebaseConf.database().ref('posts').child(keyPost).child('comment/').on('value', function (snapshot) {
      let comments = [];
      snapshot.forEach((child) => {

        let itemcmt = {
          keycmt: child.key,
          datacmt: child.val()
        }
        comments.push(itemcmt);
      });
      
      that.setState({comments});
    });
  }

  submitComment = () => {
    let databinhluan = {
      nd: this.state.nd
    };
    var newCmtKey = firebaseConf.database().ref().child('posts').push().key;
    var addCmt = {};
    addCmt['/posts/'+ this.state.item.key +'/comment/' + newCmtKey] = databinhluan;
    firebaseConf.database().ref().update(addCmt);
    this.setState({
      nd: ''
    });


  }


  render() {
    const { navigation } = this.props;
    return (
      <ScrollView style={styles.container}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{this.state.item.data.name}</Text>
        <Image source={{uri: `${this.state.item.data.image}`}} 
            style={{ width: '100%', height: 200}}
        />
        <Text>{this.state.item.data.short_desc}</Text>
        <Text>{this.state.item.data.content}</Text>
        <View style={styles.lide}></View>
        <Text style={styles.title}>Bình Luận</Text>

              {this.state.comments.map((po) =>
                  <View style={{margin: 5}}>
                    <Text style={{fontWeight: "bold", fontSize: 15}}>{po.datacmt.nd}</Text>  
                  </View> )}
                 
         <TextInput 
          style={styles.txtInput}
          defaultValue={this.state.nd}
          onChangeText={(txt) => {this.setState({nd: txt})}} />
          <TouchableOpacity 
          onPress={this.submitComment}
          style={styles.btn}>
          <Text style={styles.title}>Gửi</Text>
        </TouchableOpacity>

        
                  
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  title:{
    marginTop:10,
    marginLeft:11, fontWeight:'bold',color:'#205AA7', width: 100
  },
  btn:{
    width:40,
    marginTop:10,
    marginLeft:50,
    
  },
  txtInput: {
    fontWeight:'bold',
    borderColor: '#ccc',
    borderWidth: 1,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    width: '90%',
    marginLeft: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  },
  lide :{
    width:'100%',
    height:1,
    backgroundColor:'#110000'
  }
});