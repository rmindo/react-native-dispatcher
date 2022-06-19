import React from 'react'
import {View} from 'react-native'

/**
 * Props dispatcher
 */
import dispatcher from './dispatcher'
import components from './components'

/**
 * Context
 */
var context = {
  ref: {},
  data: {},
  state: {},
  props: {},
  history: [],
}

/**
 * Reduce children
 * @param {object} props 
 * @param {object} children 
 */
const reducer = (children) => children.reduce((items, item) => {
  var {initial, screens, children} = item.props
  if(initial && screens) {
    items.initial = {
      data: {},
      index: 0,
      name: initial,
    }
    items.screens = screens
  } else {
    if(children) {
      items[item.type.name] = children
    }
  }
  return items
}, {})

/**
 * Pass props to children components
 * @param {*} Child 
 */
export const derive = (Child) => {
  return React.memo((props) => {
    return <Child {...context.props} {...props}/>
  })
}

/**
 * Layout Container
 * @param {object} {children}
 */
export const Provider = ({children, dispatch}) => {
  var {initial, screens} = reducer(React.Children.toArray(children))

  if(initial) {
    var {props} = dispatcher(dispatch, initial, context)
    /**
     * Dispatch before the initial screen
     */
    if(props.navigate.history.length == 1) {
      Object.keys(screens).forEach(name => context.state[name] = [])
    }
    context.props = props
    /**
     * Render components
     */
    return components(screens, children, context)
  }
  throw Error('No initial route name defined')
}

/**
 * Containers
 */
export const Content = (props) => React.createElement(View, props)
export const Navigation = (props) => React.createElement(View, props)