import React from 'react';
import { ScrollView, Text, TextInput, StyleSheet,
  TouchableOpacity, View, Modal, TouchableHighlight } from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Chỉnh sửa danh mục',
};
constructor(props){
    super(props);
    this.updateCategory = this.updateCategory.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.state = {
        listCates: [],
        addCategory: "",
        modalVisible: false,
        keyUpdate:"",
        nameUpdate: "",
        key:""

    }
}
componentDidMount = () => {
    this.getCategory();
}

getCategory(){
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
}
addCategoryPost(){
    var that = this;
    let data = {
        name: this.state.addCategory,

    };

    var newKey = firebaseConf.database().ref().child('posts').push().key;
    var addCate = {};
    addCate['/categories/' + newKey] = data;
    firebaseConf.database().ref().update(addCate);
    alert('Thêm thành công')
    this.getCategory();
    that.setState({addCategory: ""});

}
removeCategory(CateKey){
  
    firebaseConf.database().ref(`categories/${CateKey}`).remove();
    this.setState({modalVisible: false});

    alert('Xóa bài danh mục thành công!');
    this.getCategory();


}

updateCategory(key){
    var name = {};
    name['/categories/' + key + '/name/'] = this.state.nameUpdate;
    firebaseConf.database().ref().update(name);
    this.setState({modalVisible: false, nameUpdate: ""});
    this.getCategory();
}

setModalVisible(visible, key, a) {
    this.setState({modalVisible: visible, keyUpdate: key, nameUpdate: a});
    var that = this;
    setTimeout(() => {
        that.setState({modalVisible: false});
    }, 100000);
}



render() {
    return (
        <ScrollView style={styles.container}>
        
            {this.state.listCates.map((cate) =>
                <View style={styles.danhsach} key={cate.key}>
                    <Text style={{fontSize:18}}>{cate.data.name}</Text>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => this.removeCategory(cate.key)}
                    >
                        <Text style={{alignItems: 'center'}}>Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            this.setModalVisible(true, cate.key, cate.data.name);
                        }}>

                        <Text style={{alignItems: 'center'}}>Sửa</Text>
                    </TouchableOpacity>

                </View>


            )}

            <TextInput
                style={styles.txtInput}
                defaultValue={this.state.addCategory}
                onChangeText={(txt) => {this.setState({addCategory: txt})}}
            />
            <TouchableOpacity
            style={{alignItems: 'center'}}
                onPress={() => {
                  if(this.state.addCategory.length!=0){
                    this.addCategoryPost();
                  }else{
                    alert('không được để trống');
                  }
           
                }} >
                <Text style={{fontSize: 20,color:'#f00'}}>Thêm</Text>
            </TouchableOpacity>



            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff'}}>
                    <View style={{ width: 200,
                        minHeight: 100,
                        backgroundColor: '#fff', borderBottomWidth: 2, justifyContent: 'center',}}>
                        <TextInput
                            style={styles.txtInput}

                            defaultValue={this.state.nameUpdate}
                            onChangeText={(txt) => {this.setState({nameUpdate: txt})}}
                        />
                        <View style={{justifyContent: 'center',  alignItems: 'center'}}>
                            
                        </View>


                        <View style={{flexDirection: 'row', alignItems: 'center',justifyContent: 'center',}}>
                            <TouchableHighlight
                                style={styles.askyesno}
                                onPress={() => {
                                    this.updateCategory(this.state.keyUpdate);
                                }}>
                                <Text>Cập nhập</Text>
                            </TouchableHighlight>
                        </View>

                    </View>
                </View>
            </Modal>


        </ScrollView>


    )
}
}
const styles = StyleSheet.create({
container:{
    flex:1,

},
danhsach: {
    flex: 1,
    flexDirection: 'row',
    margin: 10
},
btn: {
  width:80,
  height:30,
  backgroundColor: 'green',
    marginLeft: 20,
    
},
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
askyesno: {
    margin: 10,
    paddingLeft:20,
    paddingRight:15,
    backgroundColor:'#ff00',
    borderWidth: 1,
    backgroundColor: '#fff'

}

});