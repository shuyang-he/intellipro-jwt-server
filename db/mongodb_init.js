db.createUser(
  {
    user: "max",
    pwd: "max",
    roles: [ { role: "dbOwner", db: "intellipro-jwt" } ]
  }
)
db.createCollection("users");
db.users.insert({
  name: "max"
})