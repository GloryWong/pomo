import { BaseRotation2d, BaseOptions, El, Action } from './BaseRotation2D'
import Timer from './timer'
import { Merge, ValueOf, SetOptional } from 'type-fest'

export type AutoOptions = Merge<BaseOptions, {}>
export type Transition = SetOptional<{
  targetAngle: number
  speed: number
}>

export class AutoRotation2d extends BaseRotation2d {
  private timer = new Timer({
    stepSize: this.stepAngle,
  })

  private transition: Transition = {
    targetAngle: 0,
    speed: 1,
  }

  constructor(el: El, options: AutoOptions = {}) {
    super(el, options)
    this.initTimer()
  }

  protected initTimer() {
    this.timer
      .addStepCallbacks(({ counter }: { counter: number }) => {
        console.log(counter)
        this.angle = counter
        this.setCssTransformRotate(this.angle).invokeCallbacks(Action.ROTATE)
      })
      .addFinishedCallbacks(() => {
        this.rotating = false
        this.invokeCallbacks(Action.STOP_ROTATE)
      })
    return this
  }

  /// API ///

  setTransition(transition: Transition) {
    this.transition = {
      ...this.transition,
      ...transition,
    }
    return this
  }

  startTransition() {
    if (this.transition.targetAngle === this.angle) {
      return this
    }

    this.timer.setOptoins({
      from: this.angle,
      to: this.transition.targetAngle,
      speed: this.transition.speed,
    })

    console.log('from', this.angle, 'to', this.transition.targetAngle)

    this.rotating = true
    this.invokeCallbacks(Action.READY_ROTATE)
    this.timer.start()

    return this
  }

  pauseTransition() {
    this.timer.pause()
    return this
  }

  resumeTransition() {
    this.timer.resume()
    return this
  }

  transitFromTo(
    fromAngle: number,
    toAngle: ValueOf<Transition, 'targetAngle'>
  ) {
    this.angle = fromAngle
    this.transitTo(toAngle)
  }

  transitTo(
    angle: ValueOf<Transition, 'targetAngle'>,
    { speed }: { speed?: ValueOf<Transition, 'speed'> } = {}
  ) {
    this.setTransition({ targetAngle: angle, speed })
    this.startTransition()

    return this
  }
}
