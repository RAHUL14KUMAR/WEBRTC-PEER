const {Server}=require("socket.io")

const io=new Server(8000,{
  cors:true
})

// we have make a track to check konsi email id kis room mae h
const emailToSocketIdMap=new Map();

// similarly agar mujhe socket id se email nikkalana h toh we use
const socketIdToEmailMap=new Map();

io.on('connection', (socket) => {
  console.log(`socket connected`,socket.id);

  socket.on('room:join',(data)=>{
    console.log(data);
    const {email,room}=data;
    emailToSocketIdMap.set(email,socket.id);
    socketIdToEmailMap.set(socket.id,email);

    // lekin mere same room k andar already koi h toh hum usko same room k andar message bhej sake
    io.to(room).emit("user:joined",{email, id:socket.id})
    socket.join(room)

    // joh user ne room join karne ka request kiya tha usko hum bol rhe ki tum room join kar sakte ho
    io.to(socket.id).emit("room:joined",data);
  })
  

  socket.on("user:call",(data)=>{
    const {to,offer}=data;

    io.to(to).emit("incomming:call",{from:socket.id,offer})
  })

  socket.on("call:accepted",({to,ans})=>{
    io.to(to).emit("call:acceptance",{from:socket.id,ans})
  })

  socket.on("peer:nego:needed",({to,offer})=>{
    io.to(to).emit("peer:nego:needed",{from:socket.id,offer})
  })

  socket.on("peer:nego:done",({to,ans})=>{
    io.to(to).emit("peer:nego:final",{from:socket.id,ans})
  })

  socket.on('disconnect', () => {
      console.log(`user disconnected`, socket.id  );
  });
});