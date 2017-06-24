// const Map = require('pseudomap')
const framework = require('@erickmerchant/framework')
const html = require('bel')
const diff = require('nanomorph')
const target = document.querySelector('body')

framework({target, store, component, diff})(function ({dispatch}) {
  dispatch()
})

function component ({state, dispatch, next}) {
  return html`
  <body class="min-height-100vh background-light-gray dark-gray">
    <form class="typesize-x-large flex column">
      <input id="input" class="border-radius placeholder-light-gray padding-2 margin-1" placeholder="What are you doing?">
    </form>
  </body>`
}

function store (state) {
  return state
}
