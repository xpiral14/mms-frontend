

export class Definiton {
  private readonly _features: string[]

  private readonly _default_values: Record<string, number>

  private readonly _value_added_per_item: Record<string, number>

  constructor(features: string[], default_values: Record<string, number>, value_added_per_item: Record<string, number>) {
    this._features = features
    this._default_values = default_values
    this._value_added_per_item = value_added_per_item
  }

  get features(): string[] {
    return this._features
  }

  get default_values(): Record<string, number> {
    return this._default_values
  }

  get value_added_per_item(): Record<string, number> {
    return this._value_added_per_item
  }
}

export default class License {
  private readonly _id: number
  private readonly _name: string
  private readonly _type: string
  private readonly _price: number


  private readonly _definition: Definiton


  constructor(id: number, name: string, type: string, price: number, definition: Definiton) {
    this._id = id
    this._name = name
    this._type = type
    this._price = price
    this._definition = definition
  }

  get id(): number {
    return this._id
  }

  get price(): number {
    return this._price
  }

  get name(): string {
    return this._name
  }

  get type(): string {
    return this._type
  }

  get definition(): Definiton {
    return this._definition
  }
}

