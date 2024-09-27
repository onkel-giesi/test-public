
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { withAuthenticator, View, Card, Flex, Menu, MenuItem, Heading, TextField, Button, Text } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import config from './amplifyconfiguration.json';
import { useEffect, useState } from 'react';
import { listTodos } from "./graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";

Amplify.configure(config);

const client = generateClient();

function App({ signOut }) {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData = await client.graphql({ query: listTodos });
    const todosFromAPI = apiData.data.listTodos.items;
    setTodos(todosFromAPI);
  }

  async function createTodo(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get('name'),
      description: form.get('description'),
    };

    await client.graphql({
      query: createTodoMutation,
      variables: { input: data},
    });
    fetchTodos();
    event.target.reset();
  }

  async function deleteTodo({ id }) {
    const newTodo = todos.filter((todo) => todo.id !== id);
    setTodos(newTodo);
    await client.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  return (
    <View className="App">
      <Flex direction={'row'} alignItems={'center'} gap={'10px'}>
        <Card>
          <Menu>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </Card>
      </Flex>
      <Heading level={1}>My Todos App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createTodo}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Todo Name"
            label="Todo Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Todo Description"
            label="Todo Description"
            labelHidden
            variation="quiet"
            required
          />
          <Button type="submit" variation="primary">
            Create Todo
          </Button>
        </Flex>
      </View>
      <Heading level={2}>Current Todo</Heading>
      <View margin="3rem 0">
        {todos.map((todo) => (
          <Flex
            key={todo.id || todo.name}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="strong" fontWeight={700}>
              {todo.name}
            </Text>
            <Text as="span">{todo.description}</Text>
            <Button variation="link" onClick={() => deleteTodo(todo)}>
              Delete Todo
            </Button>
          </Flex>
        ))}
      </View>
    </View>
  );
}

export default withAuthenticator(App);
