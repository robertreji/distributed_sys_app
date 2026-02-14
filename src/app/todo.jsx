import { useEffect, useRef, useState } from "react"
import { View, Text, TextInput, Pressable ,FlatList} from "react-native"
import TodoComponent from "../components/todo.component"

import * as Y from "yjs"
import * as sdk from "matrix-js-sdk"
import {MatrixProvider} from "@ixo/matrix-crdt"
import * as Random from "expo-crypto"

const Todo = () => {

  const yDocRef= useRef(null);
  const yTodoref= useRef(null)
  const [text,settext] = useState("")
  const [todos,setTodoArr]= useState([])

  function textChanged(text){
    settext(text)
  }

  function addTodoPressed(){
    if (!text.trim()) return 
    if(!yTodoref.current)return
    const newTodo = new Y.Map();
    newTodo.set("id",Date.now())
    newTodo.set("todo",text)
    newTodo.set("completed",false)
    yTodoref.current.push([newTodo])
    settext("")
  }

  function removeTodo(id){
    const index=todos.findIndex(t=>t.get("id")===id)
    if(index!==-1)
    {
      yTodoref.current.delete(index,1)
    }
  }
  function toggleCompleted(id){
    const index = todos.findIndex(t=>t.get("id")===id)
    if(index!==-1)
    {
      yTodoref.current.get(index).set("completed",!yTodoref.current.get(index).get("completed"))
    }
  }
  useEffect(()=>{

 
   async function setup()
    {
      await  Random.getRandomBytesAsync(8)

      const matrixClient = sdk.createClient({
      baseUrl: "https://matrix.org",
      accessToken: "mat_Oxv9EjbdzahYCQ0nUvytMBpxfEPyXj_SP68V3",
      userId: "@oggy2005:matrix.org",
      });
      matrixClient.canSupportVoip = false;
      matrixClient.clientOpts = {
        lazyLoadMembers: true,
      };

      const yDoc= new Y.Doc()

      const provider =new MatrixProvider(yDoc,matrixClient,{
        type:"alias",
        alias:"#roomoggy:matrix.org"
      })
     await  provider.initialize();

      const yTodoArr = yDoc.getArray("todos")
      yTodoref.current=yTodoArr

      function syncUI(){
        setTodoArr(yTodoArr.toArray())
      }
      yTodoArr.observeDeep(syncUI)
      syncUI()
    };
    setup()
  },[])
  return (
    <View className="flex-1 bg-black/80 items-center pt-20">
      <TextInput
      value={text}
      onChangeText={textChanged}
        className="bg-white w-[70%] rounded-2xl px-4 py-2"
        placeholder="Enter item"
      />

      <Pressable className="mt-4 bg-green-500 px-6 py-2 rounded-xl" onPress={addTodoPressed}>
        <Text className={"text-white font-extrabold text-xl"}>Add Item</Text>
      </Pressable>

      <FlatList
        showsVerticalScrollIndicator={false}
        className={"mt-3"}
        keyExtractor={(item)=>(item.get("id").toString())}
        data={todos}
        renderItem={({ item }) => (
          <TodoComponent
          togleComplete={()=>toggleCompleted(item.get("id"))}
          iscomplete={item.get("completed")}
            text={item.get("todo")}
            removeTodo={() => removeTodo(item.get("id"))}
          />
        )}
      />
    </View>
  )
}

export default Todo