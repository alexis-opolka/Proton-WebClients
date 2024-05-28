/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.20.3
 * source: Event.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from 'google-protobuf'
export class Event extends pb_1.Message {
  #one_of_decls: number[][] = [[5]]
  constructor(
    data?:
      | any[]
      | ({
          type?: number
          content?: Uint8Array
          version?: number
          timestamp?: number
        } & {
          authorAddress?: string
        }),
  ) {
    super()
    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls)
    if (!Array.isArray(data) && typeof data == 'object') {
      if ('type' in data && data.type != undefined) {
        this.type = data.type
      }
      if ('content' in data && data.content != undefined) {
        this.content = data.content
      }
      if ('version' in data && data.version != undefined) {
        this.version = data.version
      }
      if ('timestamp' in data && data.timestamp != undefined) {
        this.timestamp = data.timestamp
      }
      if ('authorAddress' in data && data.authorAddress != undefined) {
        this.authorAddress = data.authorAddress
      }
    }
  }
  get type() {
    return pb_1.Message.getFieldWithDefault(this, 1, 0) as number
  }
  set type(value: number) {
    pb_1.Message.setField(this, 1, value)
  }
  get content() {
    return pb_1.Message.getFieldWithDefault(this, 2, new Uint8Array(0)) as Uint8Array
  }
  set content(value: Uint8Array) {
    pb_1.Message.setField(this, 2, value)
  }
  get version() {
    return pb_1.Message.getFieldWithDefault(this, 3, 0) as number
  }
  set version(value: number) {
    pb_1.Message.setField(this, 3, value)
  }
  get timestamp() {
    return pb_1.Message.getFieldWithDefault(this, 4, 0) as number
  }
  set timestamp(value: number) {
    pb_1.Message.setField(this, 4, value)
  }
  get authorAddress() {
    return pb_1.Message.getFieldWithDefault(this, 5, '') as string
  }
  set authorAddress(value: string) {
    pb_1.Message.setOneofField(this, 5, this.#one_of_decls[0], value)
  }
  get has_authorAddress() {
    return pb_1.Message.getField(this, 5) != null
  }
  get _authorAddress() {
    const cases: {
      [index: number]: 'none' | 'authorAddress'
    } = {
      0: 'none',
      5: 'authorAddress',
    }
    return cases[pb_1.Message.computeOneofCase(this, [5])]
  }
  static fromObject(data: {
    type?: number
    content?: Uint8Array
    version?: number
    timestamp?: number
    authorAddress?: string
  }): Event {
    const message = new Event({})
    if (data.type != null) {
      message.type = data.type
    }
    if (data.content != null) {
      message.content = data.content
    }
    if (data.version != null) {
      message.version = data.version
    }
    if (data.timestamp != null) {
      message.timestamp = data.timestamp
    }
    if (data.authorAddress != null) {
      message.authorAddress = data.authorAddress
    }
    return message
  }
  toObject() {
    const data: {
      type?: number
      content?: Uint8Array
      version?: number
      timestamp?: number
      authorAddress?: string
    } = {}
    if (this.type != null) {
      data.type = this.type
    }
    if (this.content != null) {
      data.content = this.content
    }
    if (this.version != null) {
      data.version = this.version
    }
    if (this.timestamp != null) {
      data.timestamp = this.timestamp
    }
    if (this.authorAddress != null) {
      data.authorAddress = this.authorAddress
    }
    return data
  }
  serialize(): Uint8Array
  serialize(w: pb_1.BinaryWriter): void
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter()
    if (this.type != 0) writer.writeInt32(1, this.type)
    if (this.content.length) writer.writeBytes(2, this.content)
    if (this.version != 0) writer.writeInt32(3, this.version)
    if (this.timestamp != 0) writer.writeUint64(4, this.timestamp)
    if (this.has_authorAddress) writer.writeString(5, this.authorAddress)
    if (!w) return writer.getResultBuffer()
  }
  static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Event {
    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes),
      message = new Event()
    while (reader.nextField()) {
      if (reader.isEndGroup()) break
      switch (reader.getFieldNumber()) {
        case 1:
          message.type = reader.readInt32()
          break
        case 2:
          message.content = reader.readBytes()
          break
        case 3:
          message.version = reader.readInt32()
          break
        case 4:
          message.timestamp = reader.readUint64()
          break
        case 5:
          message.authorAddress = reader.readString()
          break
        default:
          reader.skipField()
      }
    }
    return message
  }
  serializeBinary(): Uint8Array {
    return this.serialize()
  }
  static deserializeBinary(bytes: Uint8Array): Event {
    return Event.deserialize(bytes)
  }
}
