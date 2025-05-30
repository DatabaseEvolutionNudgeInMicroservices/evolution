// Helpers

const DataMapper = require('../helper/DataMapper.helper.js')
const { NO_ANY_NO_SCORE_UNDER_2_FILTER } = require('../helper/Constant.helper.js')

// Model

const CodeFragment = require('../model/CodeFragment.model.js')

// Errors

const BadFormat = require('../error/BadFormat.error.js')
const { INPUT_INCORRECTLY_FORMATTED } = require('../error/Constant.error.js')

/**
 * @overview This class represents the controller.
 */
class Controller {
  /**
   * Instantiates a controller.
   */
  constructor() {
    this.dataMapper = new DataMapper()
  }

  /**
   * Returns, based on a given static analysis report, the list of technologies used in a microservices architecture.
   * @param staticAnalysisReport {String} A given static analysis report.
   * @returns {Promise} A promise for the list of technologies.
   */
  getTechnologies(staticAnalysisReport) {
    return new Promise((resolve, reject) => {
      if (
        staticAnalysisReport !== undefined &&
        staticAnalysisReport !== null &&
        staticAnalysisReport.length !== 0
      ) {
        try {
          let microservicesArchitecture = this.dataMapper.revive(staticAnalysisReport)
          microservicesArchitecture = this.dataMapper.deduplicate(microservicesArchitecture)
          microservicesArchitecture = this.dataMapper.filter(
            microservicesArchitecture,
            NO_ANY_NO_SCORE_UNDER_2_FILTER
          )
          let technologies = this.dataMapper.getPropertyValueList(
            microservicesArchitecture,
            (item) => {
              return item instanceof CodeFragment ? item.getTechnology().getId() : null
            }
          )
          resolve(technologies)
        } catch (error) {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Returns, based on a given static analysis report, the list of operations used in a microservices architecture.
   * @param staticAnalysisReport {String} A given static analysis report.
   * @returns {Promise} A promise for the list of operations.
   */
  getOperations(staticAnalysisReport) {
    return new Promise((resolve, reject) => {
      if (
        staticAnalysisReport !== undefined &&
        staticAnalysisReport !== null &&
        staticAnalysisReport.length !== 0
      ) {
        try {
          let microservicesArchitecture = this.dataMapper.revive(staticAnalysisReport)
          microservicesArchitecture = this.dataMapper.deduplicate(microservicesArchitecture)
          microservicesArchitecture = this.dataMapper.filter(
            microservicesArchitecture,
            NO_ANY_NO_SCORE_UNDER_2_FILTER
          )
          let operations = this.dataMapper.getPropertyValueList(
            microservicesArchitecture,
            (item) => {
              return item instanceof CodeFragment ? item.getOperation().getName() : null
            }
          )
          resolve(operations)
        } catch (error) {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }

  /**
   * Returns, based on a given static analysis report, the list of concepts used in a microservices architecture.
   * @param staticAnalysisReport {String} A given static analysis report.
   * @returns {Promise} A promise for the list of concepts.
   */
  getConcepts(staticAnalysisReport) {
    return new Promise((resolve, reject) => {
      if (
        staticAnalysisReport !== undefined &&
        staticAnalysisReport !== null &&
        staticAnalysisReport.length !== 0
      ) {
        try {
          let microservicesArchitecture = this.dataMapper.revive(staticAnalysisReport)
          microservicesArchitecture = this.dataMapper.deduplicate(microservicesArchitecture)
          microservicesArchitecture = this.dataMapper.filter(
            microservicesArchitecture,
            NO_ANY_NO_SCORE_UNDER_2_FILTER
          )
          let concepts = this.dataMapper.getPropertyValueList(microservicesArchitecture, (item) => {
            return item instanceof CodeFragment ? item.getConcepts().map((c) => c.getName()) : null
          })
          resolve(concepts)
        } catch (error) {
          reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
        }
      } else {
        reject(new BadFormat(INPUT_INCORRECTLY_FORMATTED))
      }
    })
  }
}

module.exports = Controller
