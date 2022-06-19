import React from 'react'
import {
  View
}
from 'react-native'

/**
 * Screen and components
 */
export default (screens, children, context) => {
  /**
   * Screen
   */
  var component = ({name}) => {
    var Screen = screens[name]
    if(Screen) {
      var style = {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
      }
      var children = (
        <Screen
          ref={(ref) => {
            /**
             * Preserve ref
             */
            if(ref) {
              context.ref[name] = ref
            }
          }}
          {...context.props}
        />
      )
      return React.createElement(View, {style}, children)
    }
  }

  /**
   * Screen content
   */
  var content = (child) => {
    var _props = {
      style: {
        flex: 1,
        backgroundColor: 'white'
      },
      ...child.props
    }
    return React.cloneElement(child, _props, component(context.props.route))
  }

  /**
   * Tab navigation
   */
  var navigation = (child) => {
    var names = child.props.children.map(i => i.props.name)

    if(names.includes(context.props.route.name)) {
      return React.cloneElement(child, child.props, child.props.children)
    }
  }

  /**
   * Render components
   */
  return React.Children.map(React.Children.toArray(children), (child) => {
    switch(child.type.name) {
      case 'Content':
        return content(child)
      
      case 'Navigation':
        return navigation(child)

      case '_default':
        var _default = (child) => {
          var type = child.type({...context.props, ...child.props})
          if(type) {
            if(type.type.name == 'Content') {
              return content(type)
            }
            if(type.type.name == 'Navigation') {
              return navigation(type)
            }
          }
          return type
        }
        var type = child.type({...context.props, ...child.props})
        if(type) {
          var children = React.Children.map(React.Children.toArray(type.props.children), (child) => {
            if(child.type.name == '_default') {
              return _default(child)
            }
            if(child.type.name == 'Content') {
              return content(child)
            }
            if(child.type.name == 'Navigation') {
              return navigation(child)
            }
            return child
          })
          return React.createElement(View, type.props, children)
        }
      break

      default:
        var props = {
          ...context.props,
          ...child.props
        }
        return React.cloneElement(child, props, child.props.children)
    }
  })
}