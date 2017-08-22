import React from "react"
import ReactDOM from "react-dom"
import { onSnapshot } from "mobx-state-tree"

import "./index.css"
import App from "./components/App"
import { Bathroom } from "./models/Bathroom"

const initialState = JSON.parse(window.localStorage.getItem("bathroom") || "{}")

const bathroom = Bathroom.create(initialState)

onSnapshot(bathroom, snapshot => {
    window.localStorage.setItem("bathroom", JSON.stringify(snapshot))
})

ReactDOM.render(<App bathroom={bathroom} />, document.getElementById("root"))
