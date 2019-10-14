import React, { Component } from 'react'
import io from 'socket.io-client'
import { Route, Link } from 'react-router-dom'

import Room from './Room'
import SelectRoom from './SelectRoom'

class Rooms extends Component {
    constructor(props) {
        super(props)

        const token = window.localStorage.getItem('token')
        const socket = io('http://localhost:3001?token=' + token)

        this.state = {
            rooms: [],
            msgs: {}
        }

        // nova sala
        socket.on('newRoom', room => this.setState({ rooms: [...this.state.rooms, room] }))

        // lista todas as salas
        socket.on('roomList', rooms => this.setState({ rooms: rooms }))

        socket.on('newMsg', msg => {
            if (!this.state.msgs[msg.room]) {
                const msgs = { ...this.state.msgs }
                msgs[msg.room] = [msg]
                this.setState({ msgs })
            } else {
                const msgs = { ...this.state.msgs }
                msgs[msg.room].push(msg)
                this.setState({ msgs })
            }
        })

        /*
        socket.on('newAudio', msg => {
            if (selectedRoom === msg.room) {
                addMsg(msg)
            } else {
                // atualizar contador de msgs nao lidas
                const id = msg.room
                let count = parseInt($('#' + id + ' .notifications span').text())
                count++
                $('#' + id + ' .notifications span').text(count)
            }
        })
        */
        socket.on('msgsList', msgs => {
            if (msgs.length > 0) {
                const msgsTmp = { ...this.state.msgs }
                msgsTmp[msgs[0].room] = msgs
                this.setState({ msgs: msgsTmp })
            }
        })

        this.socket = socket
    }
    render() {
        return (
            <div className="container w-container">
                <div className="rooms">
                    <h1 className="title-rooms">Salas Disponíveis</h1>
                    <ul className="room-list w-list-unstyled">
                        {
                            this.state.rooms.map(room => {
                                return (
                                    <li className="room-item" key={room._id}>
                                        <Link to={`/rooms/${room._id}`}>{room.name}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="add-room">+</div>
                </div>
                <Route path='/rooms' exact component={SelectRoom} />
                <Route path='/rooms/:room' render={(props) => <Room {...props} socket={this.socket} msgs={this.state.msgs} />} />
            </div>
        )
    }
}

export default Rooms