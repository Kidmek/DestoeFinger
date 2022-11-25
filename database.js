const mongoose = require('mongoose')

module.exports = () => {
  mongoose
    .connect(process.env.DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log('Connected to Desto Finger DB'))
    .catch((err) => {
      console.log('Error connecting to Desto Finger DB : ', err)
    })
}
