const framework = require('@erickmerchant/framework')
const diff = require('nanomorph')
const store = require('./store')
const component = require('./body')
const target = document.body

framework({target, diff, component, store})
