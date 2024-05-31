const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '..', 'public')))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
