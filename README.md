
# React Native Dispatcher

Dispatch logic or data to all screens real-time and access it from component’s props anywhere.

### Install

`yarn add react-native-dispatcher`
Or
`npm install react-native-dispatcher`



### Usage
Create provider and load models, screens and components

```js
// ./src/App.js
import React from 'react'
import {Content, Provider} from 'react-native-dispatcher'

/**
 * Models
 */
import Models from './Models'

/**
 * Screens
 */
import Screens from './Screens'

/**
 * Screen tab and navigation
 */
import Navigation from './Navigation'
/**
 * Main App
 */
export default () => (
  <Provider dispatch={Models}>
    <Content initial={'Loader'} screens={Screens}/>
    <Navigation/>
  </Provider>
)
```


### Logic to dispatch
Sample logic to dispatch

```js
// ./src/Models/index.js
export default () => {
  return {
    add: (num1, num2) => {
      return num1 + num2;
    }
  }
}
```

### Screens
Store all screens in one object and export


```js
// ./src/Screens/index.js
import Home from './Screens/Home'
import Settings from './Screens/Settings'

export default {Home, Settings}


// ./src/Screens/Home/index.js
 export default class Home extends React.PureComponent {
  render() {
    return (
      <View>
        <Text>{this.props.add(1, 2)}</Text>
      </View>
    )
  }
}
```


### Navitation


```js
// ./src/Navigation/index.js
import React from 'react'
import {Navigation} from 'react-native-dispatcher'

/**
 * React Native Components
 */
 import {
  Text,
  TouchableOpacity
}
from 'react-native'

/**
 * 
 */
export default (({route, navigate}) => {
  var tabs = [
    {name: 'Home', 'icon': 'home'},
    {name: 'Settings', 'icon': 'settings'},
  ]
  return (
    <Navigation>
      {tabs.map(({name, icon}, key) => {
        var activeColor = {color: name === route.name ? 'red' : '#555'}
        return (
          <TouchableOpacity
            key={key}
            name={name}
            onPress={() => {
              navigate.next(name, {persist: true})
            }}>
            <Text>{name}</Text>
          </TouchableOpacity>
        )
      })}
    </Navigation>
  )
})
```



## Change Log

[Semantic Versioning](http://semver.org/)

## License

MIT
