import React from "react"
import ReactDOM from "react-dom"
import { onSnapshot } from "mobx-state-tree"

import "./index.css"
import App from "./components/App"
import { Bathroom } from "./models/Bathroom"
import { synchronizeActions } from "./utils"

const initialState = JSON.parse(window.localStorage.getItem("bathroom") || "{}")
const bathroom = Bathroom.create(initialState)

onSnapshot(bathroom, snapshot => {
    window.localStorage.setItem("bathroom", JSON.stringify(snapshot))
})

ReactDOM.render(<App bathroom={bathroom} />, document.getElementById("root"))

// const bathroom2 = Bathroom.create({})
// ReactDOM.render(<App bathroom={bathroom2} />, document.getElementById("root2"))

// synchronizeActions([bathroom, bathroom2], ["restock", "flush"])
