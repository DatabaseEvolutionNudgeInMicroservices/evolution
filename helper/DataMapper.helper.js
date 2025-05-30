// Model

const Repository = require('../model/Repository.model.js')

// Helpers

const { ALL_FILTER } = require('./Constant.helper.js')

// Error

const BadFormat = require('../error/BadFormat.error.js')
const BadFilter = require('../error/BadFormat.error.js')

// Libraries

class DataMapper {
  // ------------------------------------------------------------------------
  //                            JSON -> Object
  // ------------------------------------------------------------------------

  /**
   * Revives the static analysis report from a given string representing the JSON object.
   * @param {*} json The given JSON object in string.
   * @returns The revived static analysis report.
   */
  revive(json) {
    try {
      let jsonParsed = JSON.parse(json)
      if (jsonParsed !== undefined && jsonParsed !== null) {
        let repositories = []
        jsonParsed.forEach((repository) => {
          repositories.push(Repository.revive(repository))
        })
        return repositories
      } else {
        throw new BadFormat()
      }
    } catch (e) {
      throw new BadFormat()
    }
  }

  // ------------------------------------------------------------------------
  //                          Object -> Object
  // ------------------------------------------------------------------------

  /**
   * Removes the low-scored duplicated code fragments in the given static analysis report.
   * @param {[]} repositories The given static analysis report.
   * @returns The filtered static analysis report.
   */
  deduplicate(repositories) {
    if (repositories !== undefined && repositories !== null) {
      // Repositories
      let repositoriesDeepcopy = this.revive(JSON.stringify(repositories))
      let resultRepositories = []
      repositoriesDeepcopy.forEach((repository) => {
        resultRepositories.push(this.deduplicateRepository(repository))
      })
      return resultRepositories
    } else {
      throw new BadFormat()
    }
  }

  deduplicateRepository(repository) {
    // Directories
    let resultDirectories = []
    repository.getDirectories().forEach((directory) => {
      resultDirectories.push(this.deduplicateDirectory(directory))
    })
    repository.setDirectories(resultDirectories)
    return repository
  }

  deduplicateDirectory(directory) {
    // Directories
    let resultsDirectories = []
    directory.getDirectories().forEach((directory) => {
      resultsDirectories.push(this.deduplicateDirectory(directory))
    })
    directory.setDirectories(resultsDirectories)

    // Files
    let resultFiles = []
    directory.getFiles().forEach((file) => {
      resultFiles.push(this.deduplicateFile(file))
    })
    directory.setFiles(resultFiles)
    return directory
  }

  deduplicateFile(file) {
    let codeFragments = file.getCodeFragments().reduce((accumulator, codeFragment) => {
      let codeFragmentLocation = codeFragment.getLocation() // Code fragment location as identifier
      if (
        !accumulator[codeFragmentLocation] || // If the location is not already in the accumulator.
        Number.parseInt(accumulator[codeFragmentLocation].getScore()) < // Or if the location exists in the accumulator but the current code fragment has a bigger score.
          Number.parseInt(codeFragment.getScore())
      ) {
        accumulator[codeFragmentLocation] = codeFragment // Then keep the code fragment.
      }
      return accumulator
    }, {}) // It starts with an empty object {} as accumulator. This accumulator grows under the form of { "<location>" : codeFrament, ... }. For checking duplicates, the accessor accumulator["<location>"] is used above.
    file.setCodeFragments(
      Object.values(codeFragments) // It transforms the accumulator object under the form of { "<location>" : codeFragment, ... } to resolve the list of code fragments only.
    )
    return file
  }

  /**
   * Filters the given static analysis report.
   * @param {[Repository]} repositories The given static analysis report.
   * @param {() => {}} filter A filtering function.
   * @returns The filtered static analysis report.
   */
  filter(repositories, filter = ALL_FILTER) {
    if (repositories !== undefined && repositories !== null) {
      if (filter !== undefined && filter !== null) {
        // Repositories
        let repositoriesDeepcopy = this.revive(JSON.stringify(repositories))
        let resultRepositories = []
        repositoriesDeepcopy.forEach((repository) => {
          let resultRepository = this.filterRepository(repository, filter)
          if (resultRepository !== null) {
            resultRepositories.push(resultRepository)
          }
        })
        return resultRepositories
      } else {
        throw new BadFilter()
      }
    } else {
      throw new BadFormat()
    }
  }

  filterRepository(repository, filter) {
    if (filter(repository)) {
      // Directories
      let resultDirectories = []
      repository.getDirectories().forEach((directory) => {
        let resultDirectory = this.filterDirectory(directory, filter)
        if (resultDirectory !== null) {
          resultDirectories.push(resultDirectory)
        }
      })
      repository.setDirectories(resultDirectories)
      return repository
    }
    return null
  }

  filterDirectory(directory, filter) {
    if (filter(directory)) {
      // Directories
      let resultsDirectories = []
      directory.getDirectories().forEach((directory) => {
        let resultDirectory = this.filterDirectory(directory, filter)
        if (resultDirectory !== null) {
          resultsDirectories.push(resultDirectory)
        }
      })
      directory.setDirectories(resultsDirectories)

      // Files
      let resultFiles = []
      directory.getFiles().forEach((file) => {
        let resultFile = this.filterFile(file, filter)
        if (resultFile !== null) {
          resultFiles.push(resultFile)
        }
      })
      directory.setFiles(resultFiles)
      return directory
    }
    return null
  }

  filterFile(file, filter) {
    if (filter(file)) {
      // Code fragments
      let resultCodeFragments = []
      file.getCodeFragments().forEach((codeFragment) => {
        let resultCodeFragment = this.filterCodeFragment(codeFragment, filter)
        if (resultCodeFragment !== null) {
          resultCodeFragments.push(resultCodeFragment)
        }
      })
      file.setCodeFragments(resultCodeFragments)
      return file
    }
    return null
  }

  filterCodeFragment(codeFragment, filter) {
    if (filter(codeFragment)) {
      return codeFragment
    }
    return null
  }

  /**
   * Returns the list of values (sorted by frequency) for a given property in the given static analysis report.
   * @param {[Repository]} repositories The given static analysis report.
   * @param {() => {}} selection A selection function pointing a given property.
   * @returns The list of values of the given property.
   */
  getPropertyValueList(repositories, selection) {
    if (repositories !== undefined && repositories !== null) {
      if (selection !== undefined && selection !== null) {
        const valueMap = new Map()
        repositories.forEach((repository) => {
          const values = this.getPropertyValueListRepository(repository, selection)
          values.forEach((value) => {
            if (value !== null) {
              valueMap.set(value, (valueMap.get(value) || 0) + 1)
            }
          })
        })
        // Sort by frequency.
        return Array.from(valueMap.entries())
          .sort((a, b) => b[1] - a[1] || (a[0] > b[0] ? 1 : -1))
          .map(([value]) => value)
      } else {
        throw new BadFilter()
      }
    } else {
      throw new BadFormat()
    }
  }

  getPropertyValueListRepository(repository, selection) {
    let result = []

    result.push(selection(repository))

    repository.getDirectories().forEach((directory) => {
      result = result.concat(this.getPropertyValueListDirectory(directory, selection))
    })

    return result
  }

  getPropertyValueListDirectory(directory, selection) {
    let result = []

    result.push(selection(directory))

    directory.getDirectories().forEach((directory) => {
      result = result.concat(this.getPropertyValueListDirectory(directory, selection))
    })

    directory.getFiles().forEach((file) => {
      result = result.concat(this.getPropertyValueListFile(file, selection))
    })

    return result
  }

  getPropertyValueListFile(file, selection) {
    let result = []

    result.push(selection(file))

    file.getCodeFragments().forEach((codeFragment) => {
      result = result.concat(this.getPropertyValueListCodeFragment(codeFragment, selection))
    })

    return result
  }

  getPropertyValueListCodeFragment(codeFragment, selection) {
    return selection(codeFragment)
  }
}

module.exports = DataMapper
