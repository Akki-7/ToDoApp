import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput,
  FlatList, TouchableOpacity, Keyboard, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todoList]);

  const loadTodos = async () => {
    const stored = await AsyncStorage.getItem('todos');
    if (stored) setTodoList(JSON.parse(stored));
  };

  const saveTodos = async () => {
    await AsyncStorage.setItem('todos', JSON.stringify(todoList));
  };

  const addTodo = () => {
    if (todo.trim().length === 0) return;
    const newTodo = {
      key: Date.now().toString(),
      task: todo,
      completed: false
    };
    setTodoList([...todoList, newTodo]);
    setTodo('');
    Keyboard.dismiss();
  };

  const deleteTodo = (key) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          setTodoList(todoList.filter(item => item.key !== key));
        },
        style: "destructive"
      }
    ]);
  };

  const toggleComplete = (key) => {
    setTodoList(todoList.map(item =>
      item.key === key ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 ToDo List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task..."
          value={todo}
          onChangeText={setTodo}
        />
        <TouchableOpacity onPress={addTodo} style={styles.addButton}>
          <Ionicons name="add-circle" size={36} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ marginTop: 20 }}
        data={todoList}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => toggleComplete(item.key)}>
              <Ionicons
                name={item.completed ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={item.completed ? "#4CAF50" : "#aaa"}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Text style={[styles.todoText, item.completed && styles.completedText]}>
              {item.task}
            </Text>
            <TouchableOpacity onPress={() => deleteTodo(item.key)}>
              <Ionicons name="trash" size={22} color="#f44336" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    paddingHorizontal: 5,
  },
  todoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  }
});