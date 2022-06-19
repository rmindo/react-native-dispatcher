import React from 'react'

/**
 * Callbacks
 */
var cbs = {}

/**
 * Properties
 * @param {object} context Data pass down to the component
 * @param {object} initial Initial route
 * @returns object
 */
export default (context, initial) => {
  var [state, setState] = React.useState({route: initial, history: [initial]})
  
  /**
  * Update state when mounted
  * @param {string} name
  * @param {boolean} args
  * @returns void
  */
  const update = (name, args) => {
    if(context.state[name]) {
      var state = context.state[name]
      setTimeout(() => {
        var data = (() => {
          if(Object.values(args).length > 0) {
            if(args.state) {
              return args.state
            }
            if(args.persist) {
              return state[state.length-1]
            }
            return state[0]
          }
        })()
        context.ref[name].setState(data)
      })
    }
    context.state[name].push(context.ref[name].state)
  }

  return {
    ...state.dispatch,
    /**
     * Route
     */
    route: state.route,
    /**
     * Listener
     */
    emitter: (() => {
      return {
        add: (name, cb) => {
          cbs[name] = cb
        },
        emit: (...arg) => {
          if(cbs[arg[0]]) {
            cbs[arg[0]].apply(null, arg)
          }
        },
        once: (cb) => {
          var name = state.route.name
          if(context.ref[name]) {
            /**
             * Update state with previous state value
             */
            return update(name, state.persist)
          }
          cb()
        },
        remove: (name) => delete cbs[name]
      }
    })({}),
    /**
     * Navigator
     */
    navigate: ((history) => {
      var prev = history[history.length-1]
      return {
        history,
        /**
         * Navigate next screen
         * @param {string} name 
         * @param {object} args 
         */
        next: (name, args = {data: {}, dispatch: null, persist: false}) => {
          var route = {
            name,
            prev: prev.name,
            data: (() => {
              if(args.data || args.data === 0) {
                return args.data
              }
              return args
            })(),
            index: history.length
          }
          /**
           * Preserve route parameters
           */
          context.data[name] = {...context.data[name], ...route.data}
          /**
           * Navigate
           */
          if(prev.name !== name) {
            context.history = [
              ...history,
              route
            ]
            if(context.ref[name]) {
              update(name, args)
            }
            setState({route, history: context.history, persist: args.persist, dispatch: args.dispatch})
          }
        },
        /**
         * Back to previous screen with parameters
         * @param {object} args
         */
        back: (args = {}) => {
          history.pop()

          var route = history[history.length-1]
          var route = {
            ...route,
            data: {
              ...context.data[route.name],
              ...args.data
            }
          }
          if(context.ref[route.name]) {
            update(route.name, args)
          }
          setState({route, history, dispatch: args.dispatch})
          return true
        }
      }
    })(state.history),
    /**
     * Dispatch data into props
     * @param {*} arg 
     */
    dispatch: (arg) => {
      if(typeof arg == 'function') {
        arg = arg(context.props)
      }
      setState({...state, history: context.history, dispatch: arg})
    },
  }
}