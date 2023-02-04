import { useEffect, useRef, useState } from 'react';
import { TaskList } from './src/components/list';
import { Login } from './src/components/login';
import firebase from './src/services/firebaseConnection'
import { Feather } from '@expo/vector-icons';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [user, setUser] = useState(null)
  const [newTask, setNewTask] = useState('')
  const inputRef = useRef(null)
  const [tasks, setTasks] = useState([])
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false) 
  useEffect(()=>{
    getUserTasks()
  }, [user])
  function getUserTasks(){
     if(!user){
        return;
     } else {
        firebase.database().ref('Tasks').child(user).once('value', snapshot=>{
           snapshot?.forEach(childItem=>{
             let data = {
               key: childItem.key,
               nome: childItem.val().nome,
               checked: childItem.val().checked
             }

             setTasks(oldTasks => [...oldTasks, data].reverse())
           })
        })
     }
  }
  function deleteTask(key){
     firebase.database().ref('Tasks').child(user).child(key).remove()
     .then(()=>{
        const filterTasks = tasks.filter(item=> item.key !== key)
        setTasks(filterTasks)
     })
  }
   
  function handleEdit(data){
    setKey(data.key)
    setNewTask(data.nome)
    inputRef.current.focus()
  }

  function cancelEdit(){
    setKey('')
    setNewTask('')
  }

  function checkedTask(key){
     const tasksIndex = tasks.findIndex(item => item.key === key)
     let taskClone = tasks
     const resultClone = !taskClone[tasksIndex].checked

     firebase.database().ref('Tasks').child(user).child(key).update({
         checked: !resultClone
     })
     .then(()=>{
      taskClone[tasksIndex].checked = resultClone
      setTasks([...taskClone])
      return
     })
  }

  function addTasks(){
    if(newTask === ''){
        return
    }

    if(key !== ''){
       firebase.database().ref('Tasks').child(user).child(key).update({
          nome: newTask
       })
       .then(()=>{
          const tasksIndex = tasks.findIndex(item => item.key === key)
          let taskClone = tasks
          taskClone[tasksIndex].nome = newTask
          setTasks([...taskClone])
          setNewTask('')
          setKey('')
          return
       })
    } else{

      let tarefas = firebase.database().ref('Tasks').child(user)
      let keys = tarefas.push().key
  
      tarefas.child(keys).set({
        nome: newTask,
        checked: false
      })
      .then(()=>{
        const data = {
          key: keys,
          nome: newTask,
          checked: false
        }
        setTasks(oldTasks => [...oldTasks, data].reverse())
      })
      Keyboard.dismiss()
      setNewTask('')
      
    }
      
  }

  if(!user){
    return <Login changeStatus={(user)=>setUser(user)}/>
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        key.length > 0 && (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={cancelEdit}>
              <Feather name="x-circle" size={24} color="#FF0000" />
            </TouchableOpacity>
            <Text style={{marginLeft: 5, color: '#FF0000'}}>Você está editando uma tarefa!</Text>
          </View>
        )
      }
      <View style={styles.containerTask}>
        <TextInput
          style={styles.input}
          placeholder="o que vai fazer hoje?"
          value={newTask}
          onChangeText={setNewTask}
          ref={inputRef}
        />
        <TouchableOpacity 
          style={styles.buttonAdd}
          onPress={addTasks}
        >
          <Text style={{color: '#FFF', fontSize: 17}}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
         data={tasks}
         keyExtractor={item=>item.key}
         renderItem={({item})=>(
           <TaskList 
              tasks={item} 
              deleteItem={deleteTask} 
              editItem={handleEdit}
              check={checkedTask}
           />
         )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  },
  containerTask:{
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input:{
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderColor: '#141414',
    borderWidth: 1
  },
  buttonAdd:{
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14 ,
    borderRadius: 4
  }
});
