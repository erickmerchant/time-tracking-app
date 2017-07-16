const framework = require('@erickmerchant/framework')
const html = require('yo-yo')
const store = require('./store')
const component = require('./component')
const diff = html.update
const target = document.body

framework({target, diff, component, store})(function ({dispatch}) {
  tick()

  function tick () {
    dispatch()

    setTimeout(tick, 1000)
  }
})
