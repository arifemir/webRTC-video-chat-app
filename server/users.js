const users = []

const addUser = ({id, name, room, peerId}) => new Promise((resolve, reject) => {
    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()
  
    const existingUser = users.find(user => user.room === room && user.name === name)
  
    if(existingUser) reject({error: 'Username is taken'})
  
    const user = {id, name, room, peerId}
  
    users.push(user)
  
    resolve(user)
})

const removeUser = (id) => new Promise((resolve, reject) => {
  const index = users.findIndex(user => user.id === id)
  if(index !== -1) { return resolve(users.splice(index, 1)) }
  else return reject({error: 'User not found for removing'})
})

const getUser = (id) => new Promise((resolve, reject) => {
  const user = users.find(user => user.id === id);
  if(user) return resolve(user);
  else return reject({error: 'User not found'})
})

const getAllUser = () => {
  return users;
}

const getUsersInRoom = (room) => new Promise((resolve, reject) => {
  const onlineUsers = users.filter(user => user.room === room);
  if(onlineUsers.length !== 0) return resolve(onlineUsers)
  else return reject({error: 'User not found in room'})
})

module.exports = {
  addUser, removeUser, getUser, getUsersInRoom, getAllUser
}