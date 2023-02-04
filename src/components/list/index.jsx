import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { Feather } from '@expo/vector-icons';

export function TaskList({tasks, deleteItem, editItem, check}){
    return(
        <View style={[styles.container, {backgroundColor: tasks.checked ? '#7D0000': '#3BE403'}]}>
            <View>
               <TouchableWithoutFeedback onPress={()=>editItem(tasks)}>
                  <Text style={{color: '#FFF', paddingLeft: 10}}>{tasks.nome}</Text>
               </TouchableWithoutFeedback>
            </View>
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>check(tasks.key)}>
                  <Feather name="check-square" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={()=>deleteItem(tasks.key)}
                    style={{marginLeft: 20}}
                >
                    <Feather name="trash-2" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 4
    }
})