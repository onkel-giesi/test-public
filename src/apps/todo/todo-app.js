import { Button, Flex, Heading, Text, TextField, View } from "@aws-amplify/ui-react";

const TodoApp = ({ todosArr = [], funcCreateTodo, funcDeleteTodo }) => {
  
  return (
    <>
      <Heading level={1}>My Todos App</Heading>
      <View as="form" margin="3rem" onSubmit={funcCreateTodo}>
          <Flex direction="row" justifyContent="center">
            <Flex direction="column">
              <Flex direction="row">
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
              </Flex>
              <View name='image' as='input' type='file' style={{ alignSelf: 'end' }} />
            </Flex>
            <Button type="submit" variation="primary">
              Create Todo
            </Button>
          </Flex>
        </View>
        <Heading level={2}>Current Todo</Heading>
        <View margin="3rem">
          {todosArr.map((todo) => (
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
              <Button variation="link" onClick={() => funcDeleteTodo(todo)}>
                Delete Todo
              </Button>
            </Flex>
          ))}
        </View>
      </>
  );
}

export default TodoApp;
