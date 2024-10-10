
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { ThemeProvider, withAuthenticator, View, Card, Flex, Menu, MenuItem, ToggleButtonGroup, ToggleButton } from '@aws-amplify/ui-react';
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
import HomeApp from './apps/home/home';

Amplify.configure(config);
const client = generateClient();

//* const imagePath = 'public/testpublic/'; *//

function App({ signOut }) {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');
  const [colorMode, setColorMode] = useState('system');

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

  const getApp = () => {
    switch (content) {
      case "home":
        return <HomeApp />;
      case "todo":
        return <TodoApp todosArr={todos} funcCreateTodo={createTodo} funcDeleteTodo={deleteTodo} />
      default:
        return <HomeApp />;
    }
  }
  
  return (
    <ThemeProvider colorMode={colorMode}>
      <header>
        <Flex direction={'row'} alignItems={'center'} gap={'10px'}>
          <Card>
            <Menu>
              <MenuItem variation='primary' onClick={() => setApp('home')}>Home</MenuItem>
              <MenuItem variation='primary' onClick={() => setApp('todo')}>Todo app</MenuItem>
              <MenuItem variation='primary' onClick={signOut}>Sign out</MenuItem>
            </Menu>
          </Card>
          <Card>
            <ToggleButtonGroup value={colorMode} onChange={(value) => setColorMode(value)} size='small'>
              <ToggleButton value='light'>L</ToggleButton>
              <ToggleButton value='dark'>D</ToggleButton>
              <ToggleButton value='system'>S</ToggleButton>
            </ToggleButtonGroup>
          </Card>
        </Flex>
      </header>
      <main>
        <View className="App">
          { getApp(content) }
        </View>
      </main>
      <footer>

      </footer>
    </ThemeProvider>
  );
}

export default withAuthenticator(App, {hideSignUp: true});
