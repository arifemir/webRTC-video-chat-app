const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({log:'just running'}).status(200)
})

module.exports = router