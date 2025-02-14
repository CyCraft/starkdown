/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare global {
  interface RegExpIndicesArray extends Array<[number, number]> {
    groups?: {
      [key: string]: [number, number]
    }

    0: [number, number]
  }

  interface RegExpMatchArray {
    indices?: RegExpIndicesArray
  }

  interface RegExpExecArray {
    indices?: RegExpIndicesArray
  }

  interface RegExp {
    readonly hasIndices: boolean
  }
}
