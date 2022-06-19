import {
  Linking,
  BackHandler,
}
from 'react-native'

/**
 * Properties
 */
import properties from './properties'

/**
 * 
 */
export default (dispatch, initial, context) => {
  var props = properties(context, initial)
  /**
   * Redirect incoming url
   * @param {object} param
   */
  var deepLink = ({url}) => {
    var [path,query] = url.split('?')
    
    if(path) {
      var data = {}
      var path = path.split('/')

      if(query) {
        for(let i of query.split('&')) {
          var c = i.split('=')
          data[c[0]] = (c[1])
        }
      }

      if(path[2]) {
        if(context.deeplink) {
          var screen = context.deeplink.path[path[2]]
          if(screen) {
            props.navigate.next(screen, {
              data,
              dispatch: context.deeplink.dispatch
            })
          }
        }
        return {
          query: data,
          schema: path[0],
          pathname: path[2]
        }
      }
    }
  }

  /**
   * Deep linking
   * @param {*} arg
   */
  props.navigate.deepLink = async (arg) => {
    var url = await Linking.getInitialURL()
    if(arg) {
      context.deeplink = arg
      if(url) {
        return deepLink({url})
      }
    }
  }
  
  return {
    props: {
      /**
       * Dispatch at once before the initial screen
       */
      ...(() => {
        if(props.navigate.history.length == 1) {
          if(typeof dispatch == 'function') {
            return dispatch(props)
          }
          return dispatch
        }
      })(),
      /**
       * Old props
       */
      ...context.props,
      /**
       * Updated props
       */
      ...props
    },
    handler: (() => {
      return {
        linking: Linking.addEventListener('url', deepLink),
        backPress: BackHandler.addEventListener('hardwareBackPress', props.navigate.back)
      }
    })()
  }
}