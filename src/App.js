
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { withAuthenticator, View, Card, Flex, Menu, MenuItem } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
//* import { uploadData, getUrl } from 'aws-amplify/storage'; *//
import config from './amplifyconfiguration.json';
import { useEffect, useState } from 'react';
import { listTodos } from "./graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "./graphql/mutations";
import TodoApp from './apps/todo/todo-app';

Amplify.configure(config);
const client = generateClient();

//* const imagePath = 'public/testpublic/'; *//

function App({ signOut }) {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const setApp = (app) => {
    setContent(app);
  }

  async function fetchTodos() {
    const apiData = await client.graphql({ query: listTodos });
    const todosFromAPI = apiData.data.listTodos.items;
    await Promise.all(
      todosFromAPI.map(async (todo) => {

        //* TODO: check for image *//

        return todo;
      })
    );
    setTodos(todosFromAPI);
  }

  async function createTodo(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      name: form.get('name'),
      description: form.get('description'),
      image: form.get('image').name,
    };

    //* TODO: image upload *//

    await client.graphql({
      query: createTodoMutation,
      variables: { input: data },
    });
    fetchTodos();
    event.target.reset();
  }

  async function deleteTodo({ id, name }) {
    const newTodo = todos.filter((todo) => todo.id !== id);
    setTodos(newTodo);
    await Storage.remove(name);
    await client.graphql({
      query: deleteTodoMutation,
      variables: { input: { id } },
    });
  }

  const homeContent = <div>Hello World!</div>;

  const getApp = () => {
    switch (content) {
      case "home":
        return homeContent;
      case "todo":
        return <TodoApp todosArr={todos} funcCreateTodo={createTodo} funcDeleteTodo={deleteTodo} />
      default:
        return homeContent;
    }
  }
  
  return (
    <View className="App">
      <Flex direction={'row'} alignItems={'center'} gap={'10px'}>
        <Card>
          <Menu>

            <MenuItem onClick={() => setApp('home')}>Home</MenuItem>
            <MenuItem onClick={() => setApp('todo')}>Todo app</MenuItem>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </Card>
      </Flex>
      { getApp(content) }
    </View>
  );
}

export default withAuthenticator(App);
