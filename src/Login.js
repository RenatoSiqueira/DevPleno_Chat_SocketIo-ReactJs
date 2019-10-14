import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            success: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()
        axios
            .post('http://localhost:3001/auth', {
                name: this.name.value
            })
            .then(res => {
                const token = res.data.token
                window.localStorage.setItem('token', token)
                this.setState({ success: true })
            })
    }
    render() {
        if (this.state.success) {
            return <Redirect to='/rooms' />
        }
        return (
            <div className="cotainer-2 w-container">
                <form className="lobby" method="POST" onSubmit={this.handleSubmit}>
                    <h1 className="heading">Seja bem-vindo</h1>
                    <div>Informe seu Nome para começar:</div>
                    <input className="div-block-3" name="name" style={{ "width": "100%" }} ref={ref => this.name = ref} /><br />
                    <input type="submit" className="w-button" value="Entrar" />
                </form>
            </div>
        )
    }
}

export default Login