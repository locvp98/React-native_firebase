import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  WebView,
  Alert,
  Modal,
  ScrollView,
  ListView,
  AppRegistry,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';
import firebaseConf from '../helpers/firebase';


export default class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.getListPosts = this.getListPosts.bind(this);
    this.removePost = this.removePost.bind(this);
    this.updatePost = this.updatePost.bind(this);

    this.getLikePost = this.getLikePost.bind(this);
this.getLikeCount = this.getLikeCount.bind(this);
    this.state ={
      posts: [],
likes: [],
countlike: "",
modalVisible: false,
selectedPost: null,
keyRemove:"",
timelike:"",
showAlert: false,
key: ""
    }
  }

  static navigationOptions = {
    header: null,
  };
  componentDidMount = () => {
    this.getListPosts();
    this.getLikePost();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    var that = this;
    setTimeout(() => {
      that.setState({modalVisible: false});
    }, 3000);
  }

  getListPosts(){
    var that = this;
    firebaseConf.database().ref('posts/').on('value', function (snapshot) {
      let posts = [];
      snapshot.forEach((child) => {

        let item = {
          key: child.key,
          data: child.val()
        }
        posts.push(item);
      });
      
      that.setState({posts});
    });
  }

  getLikePost(){
    var that = this;
    firebaseConf.database().ref('posts/').child('like/').on('value', function (snapshot) {
    let likes = [];
    snapshot.forEach((child) => {
    
    let itemlike = {
    keylike: child.key,
    datalike: child.val(),
    }
    
    likes.push(itemlike);
    });
    
    that.setState({likes,
    countlike: likes.length
    });
    
    });
    
    }
    likePost(key){
    let datalike = {
    timelike: "10:10",
    
    };
    
    var newLikeKey = firebaseConf.database().ref().child('posts').push().key;
    var addLike = {};
    addLike['/posts/'+ key +'/like/' + newLikeKey] = datalike;
    firebaseConf.database().ref().update(addLike); 
    }

  removePost(postKey){

    Alert.alert(
      'Thông Báo',
      'Bạn có muốn xóa bài viết',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          firebaseConf.database().ref(`posts/${postKey}`).remove();
          alert('Xóa thành công');
        }},
      ],
      {cancelable: false},
    );

    //lay du lieu data

  }

  updatePost(data){
    // console.log(data);
    this.props.navigation.navigate('UpdatePost', {post: data});
  }

  getLikeCount(postData){
    var length = 0;
    for( var key in postData ) {
    if( postData.hasOwnProperty(key) ) {
    ++length;
    }
    }
    return length;
  }

  render() {
    const {navigate} = this.props.navigation;
      return (
        <ScrollView>
          <View style={{width: '100%', height: '100%',backgroundColor:'#DDDDDD'}}>
        <View style={{marginTop: 20, marginLeft: 5, marginRight: 5}}>


            {this.state.posts.map((po) => 
             <View key={po.key}>   
              <View style={{backgroundColor:'#fff', marginTop:10, borderRadius:7}}> 
             <TouchableOpacity  
             onPress={() => {navigate('Detail', {data: po})
             this.props.navigation.navigate('Detail', {post: po.key});
            }
             }>
          
              <Text style={styles.mota}>{po.data.short_desc}</Text>
              <View style={{width:340,height:1,backgroundColor:'#CCCCCC',marginTop:10, marginBottom:10,marginLeft:5,marginRight:5}}></View>
              <Image source={{uri: po.data.image}} style={{width: 350, height: 200, backgroundColor:'#FFF',marginRight:22}}/>
              <Text style={styles.postTitle}>{po.data.name}</Text>
              <View style={{width:340,height:1,backgroundColor:'#CCCCCC',margin:5}}></View>
              <Text style={{marginLeft:10,marginBottom:5,color:'#CCCCCC'}}>{this.getLikeCount(po.data.like)} likes</Text>
              <View style={{width:340,height:1,backgroundColor:'#CCCCCC',margin:5}}></View>
                </TouchableOpacity>

              
                <View style={{flex: 1, flexDirection: 'row'}}>

                <TouchableOpacity style={styles.capnhap}
                   
                   onPress={() => {
                   this.likePost(po.key);
                   }}
                   style={styles.removeBtn}>
                             <Image source={require('../imageanhicon/like.png')}/>
                      <Text style={[{margin:10}, styles.removeBtnLabel ]}>LIKE</Text>
                    
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.capnhap}
                  onPress={() => {
                    this.updatePost(po);
                  }}>
                            <Image source={require('../imageanhicon/update.png')}/>
                  <Text style={[{margin:5}, styles.removeBtnLabel ]}>Cập nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.removeBtn}
                  onPress={() => {
                    this.removePost(po.key);
                  }}>
                           <Image source={require('../imageanhicon/delete.png')}
                           style ={{marginLeft:15}}
                           />
                  <Text style={[{margin:10},styles.removeBtnLabel]}>Xóa</Text>
                </TouchableOpacity>

                  </View>        
                </View>
              </View>
            )}
            
        </View>
        </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  postTitle:{
    fontSize: 20,
    color: '#222222',
    fontWeight: 'bold',
    backgroundColor:'#FFF',
    alignItems: 'center',
    marginLeft:10,
    marginRight:10
    
  },
  removeBtn:{
    width: 80,
    height: 30,
    backgroundColor: '#fff',
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom : 5,
    alignItems:'center',
    flex:1,
    flexDirection: 'row'
  },
  removeBtnLabel:{
    lineHeight: 30,
    color: '#00000',
    alignItems:'center',
  },capnhap:{
    width: 80,
    height: 30,
    backgroundColor: '#FFF',
    paddingLeft: 5,
    paddingRight: 5,
    flex:1,
    marginBottom : 5,
    alignItems:'center',
    flexDirection: 'row'
  },
  like:{
    fontSize: 14,
    color: '#EEA43B',
    marginTop: 5,
   
  },
  mota:{
    marginTop:10,
    fontSize: 16,
    marginLeft:10,
    marginRight:10,
    backgroundColor:'#FFF',
  }
});
AppRegistry.registerComponent('AwesomeProject', () => FlexDirectionBasics);

