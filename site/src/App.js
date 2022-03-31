import { StyleSheet, Text, View, TextInput } from "react-native";
import { Router, Route, Link } from "../react-router";
import {TailwindProvider} from 'tailwind-rn';
import utilities from '../tailwind.json';
import {useTailwind} from 'tailwind-rn';

import React, {useState, FlatList}from "react"
import { registerRootComponent } from 'expo';


const fontSize = 13
const navHeight = 3 * fontSize

const Home = () => <Text>testing</Text>;

const Input = ({childToParent}) => {
  const tailwind = useTailwind();
  
  const [text, setText] = React.useState("");

  const handleSubmit = (event) => {
    childToParent(text)
    setText("")
  }

  return (
    <TextInput
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={handleSubmit}
      placeholder="Entrez votre commande !"
      style={{...tailwind('text-white'), borderWidth: 0, outline: 'none' }}
    />
  );
};

const MyComponent = () => {
  const tailwind = useTailwind();
  return <Text style={tailwind('text-blue-600')}>Hello world</Text>;
};

const Container = () => {
  const tailwind = useTailwind();
  
  const [textArray, setTextArray] = useState(["texet"]);
  const margin = 5
  return <View style={{...tailwind('flex flex-col'), height: `calc(100% - ${navHeight}px)`, backgroundColor: 'rgb(15, 23, 42)'}}>
    <View style={{height: `calc(100% - ${4*fontSize}px`, width: `calc(100% - ${margin}px)` }}>
      {
        textArray.map((text, i) => <Text key={i} style={{...tailwind('bg-sky-500 rounded-md p-[5px]'), margin: `${margin}px`, wordBreak: 'break-word', marginRight: 'auto'}}>{text}</Text>)
      }
    </View>
    
    <View style={{ height: 4*fontSize }} >
      <View style={{...tailwind('bg-gray-800 rounded-md flex'), height: "calc(100% - 8px)", justifyContent: "center", margin: 8, marginTop: 0, paddingHorizontal: 10, paddingBottom: 2 }}>
        <Input style={{ ...tailwind('h-full') }} childToParent={text => setTextArray([...textArray, text])} />
      </View>
    </View>
  </View>
}

const About = () => <Text>About</Text>;

const App = () => {
  return (
    <TailwindProvider utilities={utilities}>
      <Router>
        <View style={{ flex: 1, backgroundColor: 'rgb(15, 23, 42)' }}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", height: `${navHeight}px`, alignItems: "center" }}>
            <Link to="/">
              <Text style={{ color: 'royalblue' }}>Chat</Text>
            </Link>
            <Link to="/list">
              <Text style={{ color: 'royalblue' }}>Liste</Text>
            </Link>
            <Link to="/calendar">
              <Text style={{ color: 'royalblue' }}>Calendrier</Text>
            </Link>
          </View>

          <Route exact path="/" component={Container} />
          <Route exact path="/about" component={MyComponent} />
        </View>
      </Router>
    </TailwindProvider>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

registerRootComponent(App);
export default App;
