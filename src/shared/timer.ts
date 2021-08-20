import { Except } from 'type-fest'
import NP from 'number-precision'

export type Callback = Function
export type Callbacks = Callback | Array<Callback>
export type StepCallbacks = Callbacks
export type FinishedCallbacks = Callbacks
enum State {
  READY = 1,
  RUNNING,
  PAUSED,
  FINISHED,
}

type Options = {
  from?: number
  to?: number
  stepSize?: number
  speed?: number
}

export default class Timer {
  private from: number = 0
  private to: number = 0
  private stepSize: number = 1
  private speed: number = 1 // unit: second per stepSize
  private counter: number = 0
  private intervalId: number = 0
  private asc: boolean = false
  private stepCallbacks: Set<Callback> = new Set()
  private finishedCallbacks: Set<Callback> = new Set()
  private state: State = State.READY

  constructor(
    options?: Options,
    {
      stepCallbacks,
      finishedCallbacks,
    }: {
      stepCallbacks?: StepCallbacks
      finishedCallbacks?: FinishedCallbacks
    } = {}
  ) {
    options && this.setOptoins(options)
    stepCallbacks && this.addStepCallbacks(stepCallbacks)
    finishedCallbacks && this.addFinishedCallbacks(finishedCallbacks)
  }

  private init() {
    this.intervalId && clearInterval(this.intervalId)
    this.asc = this.from < this.to
    this.counter = this.from
    this.state = State.READY
    return this
  }

  setOptoins(options: Options) {
    options.from && (this.from = options.from)
    options.to && (this.to = options.to)
    options.stepSize && (this.stepSize = options.stepSize)
    options.speed && (this.speed = options.speed)
    this.init()
    return this
  }

  private addCallbacks(collection: Set<Callback>, callbacks: Callbacks): Timer {
    if (typeof callbacks === 'function') {
      collection.add(callbacks)
    } else if (Array.isArray(callbacks)) {
      collection = new Set([...collection, ...callbacks])
    }

    return this
  }

  addStepCallbacks(stepCallbacks: StepCallbacks): Timer {
    return this.addCallbacks(this.stepCallbacks, stepCallbacks)
  }

  addFinishedCallbacks(finishedCallbacks: StepCallbacks): Timer {
    return this.addCallbacks(this.finishedCallbacks, finishedCallbacks)
  }

  private invokeCallbacks(callbacks: Set<Callback>, data?: any): Timer {
    callbacks.forEach((callback) => callback(data))
    return this
  }

  private startInterval(): Timer {
    if (this.state === State.RUNNING) {
      return this
    }

    this.state = State.RUNNING

    this.intervalId = setInterval(() => {
      if (
        (this.asc && this.counter >= this.to) ||
        (!this.asc && this.counter <= this.to)
      ) {
        this.invokeCallbacks(this.finishedCallbacks, {
          counter: this.counter,
        })
        clearInterval(this.intervalId)
        return
      }

      this.counter = NP.plus(this.counter, this.stepSize * (this.asc ? 1 : -1))
      this.invokeCallbacks(this.stepCallbacks, {
        counter: this.counter,
      })
    }, 1000 / this.speed)

    return this
  }

  private pauseInterval(): Timer {
    if (this.state !== State.RUNNING) {
      return this
    }

    clearInterval(this.intervalId)
    console.log('timer pause')

    this.state = State.PAUSED
    return this
  }

  private resumeInterval(): Timer {
    if (this.state !== State.PAUSED) {
      return this
    }

    return this.startInterval()
  }

  private resetInterval(): Timer {
    return this.init()
  }

  start(): Timer {
    this.startInterval()
    return this
  }

  pause(): Timer {
    this.pauseInterval()
    return this
  }

  resume(): Timer {
    this.resumeInterval()
    return this
  }

  reset(): Timer {
    return this.resetInterval()
  }
}
