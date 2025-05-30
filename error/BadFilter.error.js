/**
 * @overview Represents a bad filter error.
 */
const { BAD_FILTER } = require('./Constant.error.js')

class BadFilter extends Error {
  constructor(message) {
    super()
    this.name = BAD_FILTER
    this.message = message !== undefined ? message : ''
  }
}

module.exports = BadFilter
