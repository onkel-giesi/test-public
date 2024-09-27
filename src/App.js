
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import { withAuthenticator, View, Card, Flex, Menu , MenuItem } from '@aws-amplify/ui-react';

function App({ signOut }) {
  return (
    <View className="App">
      <Flex direction={'row'} alignItems={'center'} gap={'10px'}>
        <Card>
          <Menu>
            <MenuItem onClick={signOut}>Sign out</MenuItem>
          </Menu>
        </Card>
      </Flex>
    </View>
  );
}

export default withAuthenticator(App);
