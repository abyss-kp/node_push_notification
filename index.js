const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 4000
app.get('/', (req, res) => res.send('Hello World!'))
const dummyDb = { subscription: null } //dummy in memory store

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  console.log("***********save-subscription**************")
  try {
    const subscription = req.body
    console.log(subscription)
    await saveToDatabase(subscription) //Method to save the subscription to Database
    res.json({ message: 'success' })
  }
  catch (err) {
    console.log("New Error 1", err)
  }
})
///To save the subscription from the user

const vapidKeys = {
  publicKey:
    'BJ5IxJBWdeqFDJTvrZ4wNRu7UY2XigDXjgiUBYEYVXDudxhEs0ReOJRBcBHsPYgZ5dyV8VjyqzbQKS8V7bUAglk',
  privateKey: 'ERIZmc5T5uWGeRxedxu92k3HnpVwy_RCnQfgek1x2Y4',
}
//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:abyss6271@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = 'someRandomData') => {
  try {
    webpush.sendNotification(subscription, dataToSend)
    console.log("Sent finally")
  }
  catch (err) {
    console.log("New Error 2", err)
  }
}
//route to test send notification
app.get('/send-notification', (req, res) => {
  try {
    const subscription = dummyDb.subscription
    const message = 'Hello World1'
    sendNotification(subscription, message)
    res.json({ message: 'message sent' })
  }
  catch (err) {
    console.log("New Error 3", err)
  }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))