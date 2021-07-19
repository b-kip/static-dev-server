(() => {
  const socketUrl = 'ws://localhost:8081';
  let socket = new WebSocket(socketUrl);
  socket.addEventListener('close', () => {
    // Server turned off due to file changes or being shut down
    // time in milliseconds
    console.log('Closed!!');
    const interAttempTimeout = 100; 
    const maxDisconnectedTime = 3000;
    const maxAttempts = Math.round(maxDisconnectedTime/interAttempTimeout);
    let attempts = 0;
    const reloadIfCanConnect =  () => {
      attempts ++;
      if( attempts > maxAttempts ) {
        console.log("Could not reconnect to dev server");
      }

      socket = new WebSocket(socketUrl);
      socket.addEventListener('error', () => {
        setTimeout(reloadIfCanConnect, interAttempTimeout);
      });
      socket.addEventListener('open', ()=> {
        console.log('Reopened!');
        location.reload();
      });
    };
    reloadIfCanConnect();
  });
})();