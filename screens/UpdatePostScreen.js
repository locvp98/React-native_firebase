import React from 'react';
import {ScrollView, Text,KeyboardAvoidingView, TextInput, StyleSheet,
        Picker, TouchableOpacity} from 'react-native';
import firebaseConf from '../helpers/firebase';
export default class UpdatePostScreen extends React.Component {
  static navigationOptions = {
    title: 'Sửa bài viết',
  };

  constructor(props){
    super(props);
    this.state = {
      key: '',
      title: "",
      category: '',
      image: "",
      short_desc: "",
      content: "",
      addCategory: "",
      listCates: []
    }
  }

  componentDidMount = () => {
    var that = this;
    firebaseConf.database().ref('categories/').once('value', function (snapshot) {
      let cates = [];
      snapshot.forEach((child) => {
        let item = {
          key: child.key,
          data: child.val()
        }
        cates.push(item);
      });
      that.setState({listCates: cates});
    });
    const { navigation } = this.props;
    let post = navigation.getParam('post');
    this.setState({
      key: post.key,
      title: post.data.name,
      category: post.data.category,
      image: post.data.image,
      short_desc: post.data.short_desc,
      content: post.data.content,
    })
  }
  
  submitPost = () => {
    let data = {
      name: this.state.title,
      category: this.state.category,
      image: this.state.image,
      short_desc: this.state.short_desc,
      content: this.state.content
    };

    var updates = {};
    updates['/posts/' + this.state.key] = data;
    firebaseConf.database().ref().update(updates);
    alert('Cập nhật bài viết thành công!');
    this.setState({
      key: '',
      title: '',
      category: 0,
      image: '',
      short_desc: '',
      content: ''
    });
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <ScrollView>
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text style={styles.label}>Tiêu đề bài viết</Text>
        <TextInput 
          style={styles.txtInput}
          defaultValue={this.state.title}
          onChangeText={txt => {this.setState({title: txt})}} />
          
        <Text style={styles.label}>Danh mục</Text>
        <Picker selectedValue={this.state.category}
            onValueChange={(val) => {this.setState({category: val})}}>
          {this.state.listCates.map((item) => 
            <Picker.Item key={item.key} label={item.data.name} value={item.key}/>  
          )}
        </Picker>
        <Text style={styles.label}>Đường dẫn ảnh</Text>
        <TextInput 
          style={styles.txtInput}
          defaultValue={this.state.image}
          onChangeText={(txt) => {this.setState({image: txt})}} />
        <Text style={styles.label}>Mô tả ngắn</Text>
        <TextInput 
          style={[styles.txtInput, styles.txtarea]}
          multiline={true}
          defaultValue={this.state.short_desc}
          onChangeText={(txt) => {this.setState({short_desc: txt})}} />
        <Text style={styles.label}>Nội dung bài viêt</Text>
        <TextInput 
          style={[styles.txtInput, styles.txtarea]}
          multiline={true}
          defaultValue={this.state.content}
          onChangeText={(txt) => {this.setState({content: txt})}} />
        <TouchableOpacity 
          onPress={this.submitPost}
          style={styles.btn}>
          <Text style={styles.btnTxt}>Lưu</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>

    )
  }
}
const styles = StyleSheet.create({
  txtInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    width: '90%',
    marginLeft: 20
  },
  label:{
    marginLeft: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  txtarea:{
    height: 100
  },
  btn:{
    backgroundColor: '#F0A52B',
    marginTop: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnTxt: {
    fontWeight: 'bold',
    color: "#fff",
    fontSize: 22
  }

});
