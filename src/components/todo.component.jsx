import { View, Text,Button ,Pressable} from 'react-native'

const TodoComponent = ({text,iscomplete,togleComplete,removeTodo}) => {
  return ( 
    <Pressable onPress={togleComplete}>
          <View on className={`${iscomplete?"bg-gray-700":"bg-white"}  w-[200px] m-3 rounded-xl px-3 py-3 flex-row items-center justify-between`}>
        <Text className="text-black">{text}</Text>
        <Pressable onPress={(e)=>{
            e.stopPropagation() 
            removeTodo()}}>
            <Text className="text-white font-bold bg-red-600 p-2 rounded-full">X</Text>
        </Pressable>
    </View>
    </Pressable>
  )
}
export default TodoComponent