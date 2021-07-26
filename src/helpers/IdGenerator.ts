class IdGenerator {
  static generateNextId(lastId: number) {
    if (isNaN(lastId)) return
    return lastId + 1
  }
}

export default IdGenerator