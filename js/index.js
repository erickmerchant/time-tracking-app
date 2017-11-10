const framework = require('@erickmerchant/framework')
const diff = require('nanomorph')
const store = require('./store')
const component = require('./component')
const target = document.body

framework({target, diff, component, store})(function (dispatch) {
  tick()

  function tick () {
    dispatch()

    setTimeout(tick, 1000)
  }
})
