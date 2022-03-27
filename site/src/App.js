import { StyleSheet, Text, View, TextInput } from "react-native";
import { Router, Route, Link } from "../react-router";
import {TailwindProvider} from 'tailwind-rn';
import utilities from '../tailwind.json';
import {useTailwind} from 'tailwind-rn';

import React from "react"
import { registerRootComponent } from 'expo';


const Home = () => <Text>testing</Text>;

const Input = () => {
  const [text, setText] = React.useState("");

  return (
    <TextInput
      label="Email"
      value={text}
      onChangeText={text => setText(text)}
      
    />
  );
};

const MyComponent = () => {
  const tailwind = useTailwind();
  return <Text style={tailwind('text-blue-600')}>Hello world</Text>;
};

const Container = () => {
  const tailwind = useTailwind();
  return <View style={{
    ...tailwind('h-full'),
  flexDirection: "column",
  padding: 20}}>
    <View style={{...tailwind('bg-gray-500 h-4/5'), }} />
    <View style={{...tailwind('rounded border-2 border-black h-1/5'), }} >
      <Input />
    </View>
  </View>
}

const About = () => <Text>About</Text>;

const App = () => (
  <TailwindProvider utilities={utilities}>
    <Router>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Link to="/">
            <Text>Home</Text>
          </Link>
          <Link to="/about">
            <Text>About</Text>
          </Link>
        </View>

        <Route exact path="/" component={Container} />
        <Route exact path="/about" component={MyComponent} />
      </View>
    </Router>
  </TailwindProvider>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
    height: "100%",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

registerRootComponent(App);
export default App;
