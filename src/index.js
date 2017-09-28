import React from "react"
import ReactDOM from "react-dom"
import { onSnapshot } from "mobx-state-tree"

import "./index.css"

import Bathroom from "./components/Bathroom"
import { Bathroom as BathroomModel } from "./models/Bathroom"

const emptyBathroom = {
    amountOfToiletPaper: 3,
    painting: {},
    toilet: { pile: [{ type: "🦆", name: "Donald" }] }
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

window.bathroom = bathroom // for console access
