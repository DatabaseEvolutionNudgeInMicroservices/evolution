// Model

const CodeFragment = require('../model/CodeFragment.model.js')

// Filters

const ALL_FILTER = (x) => {
  // Excluding nothing.
  return x
}

const NO_ANY_FILTER = (codeFragment) => {
  // Excluding the javascript-any-any-file code fragments.
  return !(
    codeFragment instanceof CodeFragment &&
    codeFragment.getTechnology().getId() === 'javascript-any-any-file'
  )
}

const NO_ANY_NO_SCORE_UNDER_2_FILTER = (codeFragment) => {
  // Excluding the javascript-any-any-file code fragments and the ones with a score lower than or equal to 2.
  return !(
    (codeFragment instanceof CodeFragment && Number.parseInt(codeFragment.getScore()) <= 2) ||
    (codeFragment instanceof CodeFragment &&
      codeFragment.getTechnology().getId() === 'javascript-any-any-file')
  )
}

module.exports = {
  ALL_FILTER,
  NO_ANY_FILTER,
  NO_ANY_NO_SCORE_UNDER_2_FILTER
}
