const express = require("express")
const SpotifyWebApi = require("spotify-web-api-node")
const bodyParser = require("body-parser")

const pretty = obj => JSON.stringify(obj, null, 2)

const spot = new SpotifyWebApi({
  clientId: "2562cdad253c4761a3ae6dc4ef20d850",
  clientSecret: "9c5f722fd1134445a02b81764d22564e"
})

const capitalize = term => term.replace(/^\w/, c => c.toUpperCase())

const searchBy = opts => {
  const obj = "search" + capitalize(opts.obj)
  console.log(obj)
  const prefix = opts.subj ? opts.subj.toLowerCase() + ":" : ""
  return spot[obj](prefix + opts.term)
}

const app = express()

app.use(bodyParser.json())

app.post("/search", (req, res) => {
  console.log("Got search-request", pretty(req.body))
  searchBy(req.body).then(data => {
    console.log(data)
    res.send(data.body[req.body.obj.toLowerCase()])
  })
})

spot.clientCredentialsGrant().then(data => {
  spot.setAccessToken(data.body["access_token"])
  console.log("Set access-token: ", data.body["access_token"])
  app.listen(3000, () => console.log("Server listening on 3000"))
})
