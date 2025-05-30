// Controllers

const Controller = require('../../controller/Controller.controller.js')

// Errors

const BadFormat = require('../../error/BadFormat.error.js')

// Setup

const staticAnalysisReportJson =
  '[{"location":"https://www.github.com/user/project/blob/master/","directories":[{"location":"https://www.github.com/user/project/blob/master/js/","directories":[{"location":"https://www.github.com/user/project/blob/master/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/user/:userId\'"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/project/blob/master/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]},{"location":"https://www.github.com/user/projectClone/blob/master/","directories":[{"location":"https://www.github.com/user/projectClone/blob/master/js/","directories":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/user/:userId\'"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]}]'

// Happy path test suite

describe('Controller', () => {
  it('returns, based on a static analysis report, the list of technologies used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await controller.getTechnologies(staticAnalysisReportJson).then((result) => {
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify([
          'javascript-api-express-call',
          'javascript-db-mongo-call',
          'javascript-db-redis-call'
        ])
      )
    })
  })

  it('returns, based on a static analysis report, the list of operations used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await controller.getOperations(staticAnalysisReportJson).then((result) => {
      expect(JSON.stringify(result)).toEqual(JSON.stringify(['READ']))
    })
  })

  it('returns, based on a static analysis report, the list of concepts used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await controller.getConcepts(staticAnalysisReportJson).then((result) => {
      expect(JSON.stringify(result)).toEqual(JSON.stringify(['user']))
    })
  })
})

// Failure cases test suite

describe('Controller tries to', () => {
  it('return, based on a null static analysis report, the list of technologies used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getTechnologies(null)).rejects.toThrow(BadFormat)
  })

  it('return, based on an undefined static analysis report, the list of technologies used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getTechnologies(undefined)).rejects.toThrow(BadFormat)
  })

  it('return, based on an empty static analysis report, the list of technologies used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getTechnologies('')).rejects.toThrow(BadFormat)
  })

  it('return, based on a incorrectly formatted static analysis report, the list of technologies used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getTechnologies('{')).rejects.toThrow(BadFormat)
  })

  it('return, based on a null static analysis report, the list of operations used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getOperations(null)).rejects.toThrow(BadFormat)
  })

  it('return, based on an undefined static analysis report, the list of operations used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getOperations(undefined)).rejects.toThrow(BadFormat)
  })

  it('return, based on an empty static analysis report, the list of operations used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getOperations('')).rejects.toThrow(BadFormat)
  })

  it('return, based on a incorrectly formatted static analysis report, the list of operations used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getOperations('{')).rejects.toThrow(BadFormat)
  })

  it('return, based on a null static analysis report, the list of concepts used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getConcepts(null)).rejects.toThrow(BadFormat)
  })

  it('return, based on an undefined static analysis report, the list of concepts used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getConcepts(undefined)).rejects.toThrow(BadFormat)
  })

  it('return, based on an empty static analysis report, the list of concepts used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getConcepts('')).rejects.toThrow(BadFormat)
  })

  it('return, based on a incorrectly formatted static analysis report, the list of concepts used in a microservices architecture', async () => {
    // Given

    let controller = new Controller()

    // When Then

    await expect(controller.getConcepts('{')).rejects.toThrow(BadFormat)
  })
})
