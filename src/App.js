import React from 'react'

function App() {
  return (
    <div className="cotainer-2 w-container">
      <form className="lobby" method="POST">
        <h1 className="heading">Seja bem-vindo</h1>
        <div>Informe seu Nome para começar:</div>
        <input className="div-block-3" name="name" style={{ "width": "100%" }} /><br />
        <input type="submit" className="w-button" value="Entrar" />
      </form>
    </div>
  )
}

export default App