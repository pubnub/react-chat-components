var uuid = require('../uuid')
var expect = require('chai').expect

describe('uuid', function () {
  it('should expose the VERSION property', function () {
    expect(uuid.VERSION).to.be.a('string')
  })

  it('should generate a valid UUID version 4', function () {
    expect(uuid.isUUID(uuid(), 4)).to.be.true
  })

  it('should be a valid UUID version 4', function () {
    expect(uuid.isUUID('9c858901-8a57-4791-81fe-4c455b099bc9', 4)).to.be.true
  })

  it('should not be a valid UUID version 4', function () {
    expect(uuid.isUUID('A987FBC9-4BED-3078-CF07-9141BA07C9F3', 4)).to.be.false
  })

  it('should be a valid UUID version 3', function () {
    expect(uuid.isUUID('A987FBC9-4BED-3078-CF07-9141BA07C9F3', 3)).to.be.true
  })

  it('should be a valid UUID version 5', function () {
    expect(uuid.isUUID('987FBC97-4BED-5078-BF07-9141BA07C9F3', 5)).to.be.true
  })

  it('should not be a valid UUID version 3', function () {
    expect(uuid.isUUID('987FBC97-4BED-5078-BF07-9141BA07C9F3', 3)).to.be.false
  })

  it('should be a valid UUID version 4', function () {
    expect(uuid.isUUID('987FBC97-4BED-5078-BF07-9141BA07C9F3', 4)).to.be.false
  })

  it('should be a valid UUID without specifying version', function () {
    expect(uuid.isUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).to.be.true
  })

  it('should not be a valid UUID version 5', function () {
    expect(uuid.isUUID('xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3')).to.be.false
    expect(uuid.isUUID(null)).to.be.false
    expect(uuid.isUUID(undefined)).to.be.false
    expect(uuid.isUUID({})).to.be.false
    expect(uuid.isUUID([])).to.be.false
  })
})
