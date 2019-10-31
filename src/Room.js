import React, { Component } from 'react'

class Room extends Component {
    constructor(props) {
        super(props)

        const socket = this.props.socket
        this.roomId = this.props.match.params.room
        const roomId = this.roomId
        socket.emit('join', roomId)

        this.audioPermission = false

        navigator
            .mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                this.audioPermission = true
                this.mediaRecorder = new MediaRecorder(stream)
                let chunks = []

                this.mediaRecorder.ondataavailable = data => {
                    //data received
                    chunks.push(data.data)
                }
                this.mediaRecorder.onstop = () => {
                    // data stopped
                    const reader = new window.FileReader()
                    const blob = new Blob(chunks, { type: 'audio/ogg; codec=opus' })
                    reader.readAsDataURL(blob)
                    reader.onloadend = () => {
                        socket.emit('sendAudio', {
                            data: reader.result,
                            room: this.roomId
                        })
                    }

                    chunks = []
                }
            }, err => {
                this.mediaRecorder = null
                this.audioPermission = false
            })




        this.handleKey = this.handleKey.bind(this)
        this.renderMessage = this.renderMessage.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseDown = this.mouseDown.bind(this)
    }
    componentWillReceiveProps(newProps) {
        if (newProps.match.params.room && this.roomId !== newProps.match.params.room) {
            this.roomId = newProps.match.params.room
            this.props.socket.emit('join', this.roomId)
        }
    }
    mouseUp() {
        this.mediaRecorder.stop()
    }
    mouseDown() {
        this.mediaRecorder.start()
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
            : <audio src={msg.message} controls={true}></audio>
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
                        <button type="button" className="send-audio w-button" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}>Enviar<br />Áudio</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Room