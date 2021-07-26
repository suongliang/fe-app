export namespace Models {
  export class Employee {
    constructor(id: number, name: string, email: string, createdAt: Date, position: string) {
      this.id = id
      this.name = name
      this.email = email
      this.position = position
      this.createdAt = createdAt
    }

    id: number
    createdAt: Date
    name: string
    email: string
    position: string
  }
  export class Position {
    constructor(id: number, name: string) {
      this.id = id
      this.name = name
    }

    id: number
    name: string
  }
}