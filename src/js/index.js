const framework = require('@erickmerchant/framework')
const html = require('yo-yo')
const store = require('./store')
const component = require('./component')
const actions = require('./actions')
const diff = html.update
const target = document.body

framework({target, diff, component, store})(initialize)

function initialize ({dispatch}) {
  const {initialize} = actions({dispatch})

  initialize()

  tick()

  function tick () {
    dispatch()

    setTimeout(tick, 1000)
  }
}
