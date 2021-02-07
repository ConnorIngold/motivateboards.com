const helloWorld = async () => {
	await User.sync({ alter: true })
}

// const helloWorld = async () => {
// 	await console.log('hello world')
// }

module.exports = helloWorld
