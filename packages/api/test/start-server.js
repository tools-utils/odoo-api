import server from '../src'

const instance = server.listen(9000)
console.log(`Server is running at port 9000...`)

export default instance