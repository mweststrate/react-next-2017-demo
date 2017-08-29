import React from "react"
import ReactDOM from "react-dom"
import { onSnapshot, onPatch } from "mobx-state-tree"
import { Provider } from "mobx-react"

import "./index.css"
import Bathroom from "./components/App"
import { Bathroom as BathroomModel } from "./models/Bathroom"
import { synchronizeActions } from "./utils"

const emptyBathroom = {
    toilet: { pile: [] },
    painting: {}
}

const initialState =
    window.localStorage.getItem("bathroom") || false
        ? JSON.parse(window.localStorage.getItem("bathroom"))
        : emptyBathroom

const bathroom = BathroomModel.create(initialState)

onSnapshot(bathroom, snapshot => {
    window.localStorage.setItem("bathroom", JSON.stringify(snapshot))
})

ReactDOM.render(<Bathroom bathroom={bathroom} />, document.getElementById("root"))
