export type Callback = Function
export type Callbacks = Callback | Array<Callback>
export type StepCallbacks = Callbacks
export type FinishedCallbacks = Callbacks
enum State {
  READY = 1,
  RUNNING,
}

export default class Timer {
  private min: number = 0
  private max: number = 0
  private step: number = 1
  private stepDuration: number = 1 // unit: second
  private count: number = 0
  private intervalId: number = 0
  private asc: boolean = false
  private stepCallbacks: Set<Callback> = new Set()
  private finishedCallbacks: Set<Callback> = new Set()
  private state: State = State.READY

  constructor({
    min,
    max,
    step,
    stepDuration,
    asc,
    stepCallbacks,
    finishedCallbacks,
  }: {
    min?: number
    max?: number
    step?: number
    stepDuration?: number
    asc?: boolean
    stepCallbacks?: StepCallbacks
    finishedCallbacks?: FinishedCallbacks
  }) {
    min && (this.min = min)
    max && (this.max = max)
    step && (this.step = step)
    stepDuration && (this.stepDuration = stepDuration)
    asc !== undefined && (this.asc = asc)
    this.addStepCallbacks(stepCallbacks || [])
    this.addFinishedCallbacks(finishedCallbacks || [])
    this.init()
  }

  private init(): Timer {
    this.count = this.asc ? this.min : this.max
    return this
  }

  setRange(min: number, max: number): Timer {
    if (this.state === State.RUNNING) {
      return this
    }

    this.min = min
    this.max = max
    return this.init()
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

    this.intervalId = setInterval(() => {
      if (
        (this.asc && this.count === this.max) ||
        (!this.asc && this.count === this.min)
      ) {
        clearInterval(this.intervalId)
        return
      }

      this.count += this.step * (this.asc ? 1 : -1)
      // console.log(this.count)
      this.invokeCallbacks(this.stepCallbacks)
    }, this.stepDuration * 1000)

    console.log('timer start:', this.min, this.max)
    this.state = State.RUNNING
    return this
  }

  private pauseInterval(): Timer {
    if (this.state === State.READY) {
      return this
    }

    clearInterval(this.intervalId)
    console.log('timer pause')

    this.state = State.READY
    return this
  }

  private resumeInterval(): Timer {
    if (this.state === State.RUNNING) {
      return this
    }

    return this.startInterval()
  }

  private resetInterval(): Timer {
    clearInterval(this.intervalId)
    this.init()
    return this
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
