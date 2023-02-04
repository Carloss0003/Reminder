import firebase from '../../services/firebaseConnection';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

export function Login({changeStatus}) {
    const [type, setType] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleLogin(){
       if(type){
           firebase.auth().signInWithEmailAndPassword(email, password)
           .then((user)=>{
                setEmail('')
                setPassword('')
                changeStatus(user.user.uid)
           })
           .catch((err)=>{
             alert('ops, confira seus dados e tente novamente')
             console.log(err)
             return
           })
       } else{
           firebase.auth().createUserWithEmailAndPassword(email, password)
           .then((user)=>{
              changeStatus(user.user.uid)
           })
           .catch((err)=>{
              alert('ops, algo deu errado')
              console.log(err)
              return
           })
       }   
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder='seu email'
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType={'email-address'}
                autoFocus
            />
            <TextInput
                placeholder='sua senha'
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity 
                style={[styles.login, {backgroundColor: type? '#3ea6f2': '#141414'}]}
                onPress={handleLogin}
            >
                <Text style={styles.textLogin}>
                   {type ? 'Acessar' : 'Cadastrar'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setType(!type)}>
                <Text style={{textAlign:'center'}}>
                   {type ? 'Criar conta' : 'Já possuo uma conta'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f2f6fc',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  input:{
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#141414'
  },
  login:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 4,
    marginBottom: 10
  },
  textLogin:{
    color: '#FFF',
    fontSize: 17
  }
});
