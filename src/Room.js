import React, { Component } from 'react'

class Room extends Component {
    constructor(props) {
        super(props)

        const socket = this.props.socket
        const roomId = this.props.match.params.room
        socket.emit('join', roomId)



        let mediaRecorder
        let audioPermission = false

        navigator
            .mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                audioPermission = true
                mediaRecorder = new MediaRecorder(stream)
                let chunks = []

                mediaRecorder.ondataavailable = data => {
                    //data received
                    chunks.push(data.data)
                }
                mediaRecorder.onstop = () => {
                    // data stopped
                    const reader = new window.FileReader()
                    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' })
                    reader.readAsDataURL(blob)
                    reader.onloadend = () => {
                        socket.emit('sendAudio', {
                            data: reader.result,
                            //room: selectedRoom
                        })
                    }

                    chunks = []
                }
            }, err => {
                mediaRecorder = null
                audioPermission = false
            })




        this.handleKey = this.handleKey.bind(this)
        this.renderMessage = this.renderMessage.bind(this)
    }
    mouseUp() {

    }
    mouseDown() {

    }

    handleKey(e) {
        if (e.keyCode === 13) {
            this.props.socket.emit('sendMsg', {
                msg: this.msg.value,
                room: this.props.match.params.room
            })
            this.msg.value = ''
        }
    }
    renderContent(msg) {
        return (msg.msgType === 'text')
            ? msg.message
            : <audio src={msg.message} controls="true"></audio>
    }
    renderMessage(msg) {
        return (
            <div className="message" key={msg._id}>
                <span className="author">{msg.author}</span>
                <br />
                <span className="msg-body">{this.renderContent(msg)}</span>
            </div>
        )
    }
    render() {
        const room = this.props.match.params.room
        const msgs = this.props.msgs[room]
        return (
            <div className="room">
                <div className="messages">
                    {msgs && msgs.map(this.renderMessage)}
                </div>
                <div className="new-message-form w-form">
                    <form id="email-form" name="email-form" data-name="Email Form" className="form">
                        <textarea id="msg" name="msg" maxLength={5000} placeholder="Digite sua mensagem e pressione &lt;Enter&gt;"
                            autoFocus={true} className="msg w-input" onKeyUp={this.handleKey} ref={ref => this.msg = ref}></textarea>
                        <button type="button" className="send-audio w-button">Enviar<br />Áudio</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Room