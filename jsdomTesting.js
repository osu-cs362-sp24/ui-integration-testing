const JSDOM = require("jsdom").JSDOM

const dom = new JSDOM(
  "<!DOCTYPE html><p id='hello'>Hello world</p>"
)

console.log(dom.serialize())

// window, document

const document = dom.window.document
const paragraph = document.getElementById("hello")

console.log("paragraph:", paragraph.textContent)
