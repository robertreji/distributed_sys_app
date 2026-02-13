

import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import * as sdk from "matrix-js-sdk";
import { MatrixProvider } from "@ixo/matrix-crdt";
import * as Random from "expo-crypto";

export default function MatrixTodo() {
  const initialized = useRef(false);
  const ydocRef = useRef(null);
  const yarrayRef = useRef(null);

  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const runMatrix = async () => {
      await Random.getRandomBytesAsync(32);

      const matrixClient = sdk.createClient({
        baseUrl: "https://matrix.org",
        accessToken: "mat_oHNVGtmjpPE3aNGulV9eWxSBoGAe99_2dm0P1",
        userId: "@oggy2005:matrix.org",
      });

      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      const provider = new MatrixProvider(ydoc, matrixClient, {
        type: "alias",
        alias: "#todo2005:matrix.org",
        enableExperimentalWebrtcSync: false,
      });

      provider.initialize();

      const yarray = ydoc.getArray("todos");
      yarrayRef.current = yarray;

      const updateUI = () => {
        setTodos(yarray.toArray());
      };

      yarray.observe(updateUI);
      updateUI();
    };

    runMatrix();
  }, []);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
    };

    yarrayRef.current.push([newTodo]);
    setInput("");
  };

  const toggleTodo = (id) => {
    const yarray = yarrayRef.current;
    const index = yarray.toArray().findIndex(t => t.id === id);
    if (index === -1) return;

    const current = yarray.get(index);
    yarray.delete(index, 1);
    yarray.insert(index, [{
      ...current,
      completed: !current.completed
    }]);
  };

  return (
    <View style={{ padding: 20, marginTop: 40 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Matrix CRDT Todo
      </Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter todo..."
        style={{
          borderWidth: 1,
          padding: 8,
          marginBottom: 10,
        }}
      />

      <Button title="Add Todo" onPress={addTodo} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTodo(item.id)}
            style={{
              padding: 10,
              marginTop: 10,
              backgroundColor: item.completed ? "#d3ffd3" : "#fff",
              borderWidth: 1,
            }}
          >
            <Text
              style={{
                textDecorationLine: item.completed ? "line-through" : "none",
              }}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}