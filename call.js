// Initialize Peer
var peer;
var myStream;
var peerList = [];

function init(userId) {
    peer = new Peer(userId); // Create Peer instance with userId
    peer.on('open', (id) => {
        console.log(id + " connected");
    })
    listenToCall()
}

function listenToCall() {
    peer.on('call', (call) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                myStream = stream;
                addLocalVideo(stream); // Add the local video stream
                call.answer(stream); // Answer the call with the local stream
                call.on('stream', (remoteStream) => {
                    if (!peerList.includes(call.peer)) {
                        addRemoteVideo(remoteStream); // Add the remote video stream
                        peerList.push(call.peer); // Track peers
                    }
                });
            })
            .catch((err) => {
                console.log("Unable to connect because: " + err);
            });
    });
}

function makeCall(receiverId) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            myStream = stream;
            addLocalVideo(stream); // Add the local video stream
            let call = peer.call(receiverId, stream); // Initiate the call
            call.on('stream', (remoteStream) => {
                if (!peerList.includes(call.peer)) {
                    addRemoteVideo(remoteStream); // Add the remote video stream
                    peerList.push(call.peer); // Track peers
                }
            });
        })
        .catch((err) => {
            console.log("Unable to connect because: " + err);
        });
}

function addLocalVideo(stream) {
    // Create a new video element for local video stream
    let video = document.createElement('video');
    video.srcObject = stream;
    video.classList.add("video");
    video.muted = true;
    video.play();
    document.getElementById("localVideo").append(video); // Append to local video container
}


// This Function will add remote stream 

function addRemoteVideo(stream){
    let video = document.createElement('video');
    video.srcObject = stream;
    video.classList.add("video");
    video.play();
    document.getElementById("remoteVideo").append(video);

}