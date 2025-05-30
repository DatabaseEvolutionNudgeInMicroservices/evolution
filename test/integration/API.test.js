const request = require('supertest')

const baseURL = 'http://localhost:8080' // If dockerized.
//const baseURL = 'http://localhost:3000' // If not dockerized, launch from the npm console.

// Setup

const jsonData = JSON.parse(
  '[{"location":"https://www.github.com/user/project/blob/master/","directories":[{"location":"https://www.github.com/user/project/blob/master/js/","directories":[{"location":"https://www.github.com/user/project/blob/master/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/project/blob/master/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/user/:userId\'"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/project/blob/master/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/project/blob/master/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/project/blob/master/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]},{"location":"https://www.github.com/user/projectClone/blob/master/","directories":[{"location":"https://www.github.com/user/projectClone/blob/master/js/","directories":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/","directories":[],"files":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L1C1L2C2","technology":{"id":"javascript-api-express-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"\'/user/:userId\'"},"concepts":[{"name":"user"}],"heuristics":"E1E2E3E4E5E6E7E8","score":"8"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L3C3L4C4","technology":{"id":"javascript-db-mongo-call"},"operation":{"name":"READ"},"method":{"name":"find"},"sample":{"content":"user {\\"user_id\\":userId}"},"concepts":[{"name":"user"}],"heuristics":"M1M2M3M4M5M6","score":"6"},{"location":"https://www.github.com/user/projectClone/blob/master/js/app/app.js#L5C5L6C6","technology":{"id":"javascript-db-redis-call"},"operation":{"name":"READ"},"method":{"name":"get"},"sample":{"content":"USER_ID:userId"},"concepts":[{"name":"user"}],"heuristics":"R1R2R3R4R5R6","score":"6"}]}]}],"files":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app.js","linesOfCode":1,"codeFragments":[{"location":"https://www.github.com/user/projectClone/blob/master/js/app.js#L0C0L0C0","technology":{"id":"javascript-any-any-file"},"operation":{"name":"OTHER"},"method":{"name":" "},"sample":{"content":" "},"concepts":[],"heuristics":"A1","score":"1"}]}]}]}]'
)

// Happy path test suite

describe('DENIM Evolution API', () => {
  it('returns, based on a static analysis report, the list of technologies used in a microservices architecture', () => {
    return request(baseURL)
      .post('/technologies')
      .send(jsonData)
      .expect(200)
      .then((response) => {
        // Then
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify([
            'javascript-api-express-call',
            'javascript-db-mongo-call',
            'javascript-db-redis-call'
          ])
        )
      })
  })

  it('returns, based on a static analysis report, the list of operations used in a microservices architecture', () => {
    return request(baseURL)
      .post('/operations')
      .send(jsonData)
      .expect(200)
      .then((response) => {
        // Then
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(['READ']))
      })
  })

  it('returns, based on a static analysis report, the list of concepts used in a microservices architecture', () => {
    return request(baseURL)
      .post('/concepts')
      .send(jsonData)
      .expect(200)
      .then((response) => {
        // Then
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(['user']))
      })
  })
})

// Failure cases test suite

describe('DENIM Evolution API', () => {
  it('tries to return, based on an incomplete static analysis report, the list of technologies used in a microservices architecture', async () => {
    return request(baseURL).post('/technologies').send(JSON.parse('{}')).expect(406)
  })

  it('tries to return, based on a null static analysis report, the list of technologies used in a microservices architecture', async () => {
    return request(baseURL).post('/technologies').send(JSON.parse(null)).expect(406)
  })

  it('tries to return, based on an incomplete static analysis report, the list of operations used in a microservices architecture', async () => {
    return request(baseURL).post('/operations').send(JSON.parse('{}')).expect(406)
  })

  it('tries to return, based on a null static analysis report, the list of operations used in a microservices architecture', async () => {
    return request(baseURL).post('/operations').send(JSON.parse(null)).expect(406)
  })

  it('tries to return, based on an incomplete static analysis report, the list of concepts used in a microservices architecture', async () => {
    return request(baseURL).post('/concepts').send(JSON.parse('{}')).expect(406)
  })

  it('tries to return, based on a null static analysis report, the list of concepts used in a microservices architecture', async () => {
    return request(baseURL).post('/concepts').send(JSON.parse(null)).expect(406)
  })
})
