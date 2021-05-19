import { Container } from '../src/docker'
import child_process from 'child_process'

jest.mock('child_process')

const mockExecSync = child_process.execSync as jest.MockedFunction<typeof child_process.execSync>

/**
 * Test container class
 */
describe('container class', function () {
  beforeEach(() => {
    const inspect = [{
      HostConfig: {
        Binds: ['label1:directory1', 'label2:directory2']
      }
    }]
    mockExecSync.mockReturnValue(Buffer.from(JSON.stringify(inspect)))
  })

  afterEach(() => {
    mockExecSync.mockClear()
  })

  describe('constructor method', function () {
    it('execute constructor method', function () {
      const container = new Container('exists_container')
      expect(container.name).toBe('exists_container')
    })

    it('failed - execute constructor method', function () {
      mockExecSync.mockReturnValue(Buffer.from(JSON.stringify({})))
      expect(() => {
        const container = new Container('not_exists_container')
      }).toThrow()
    })
  })

  describe('start method', function () {
    it('execute start method', function () {
      const container = new Container('exists_container')
      container.start()
      expect(mockExecSync.mock.calls).toMatchObject([
        ['docker inspect exists_container'],
        ['docker start exists_container']
      ])
    })
  })

  describe('stop method', function () {
    it('execute stop method', function () {
      const container = new Container('exists_container')
      container.stop()
      expect(mockExecSync.mock.calls).toMatchObject([
        ['docker inspect exists_container'],
        ['docker stop exists_container']
      ])
    })
  })

  describe('inspect method', function () {
    it('execute inspect method', function () {
      const container = new Container('exists_container')
      container.inspect()
      expect(mockExecSync.mock.calls).toMatchObject([
        ['docker inspect exists_container'],
        ['docker inspect exists_container']
      ])
    })
  })
})
