import React from "react"
import ReactDOM from "react-dom"
import { onSnapshot } from "mobx-state-tree"
import { Provider } from "mobx-react"

import "./index.css"
import Bathroom from "./components/App"
import { Bathroom as BathroomModel } from "./models/Bathroom"
import { synchronizeActions } from "./utils"

const emptyBathroom = {
    toilet: { pile: [] },
    painting: {}
}

const initialState = window.localStorage.getItem("bathroom")
    ? JSON.parse(window.localStorage.getItem("bathroom"))
    : emptyBathroom

const bathroom = BathroomModel.create(initialState)

onSnapshot(bathroom, snapshot => {
    window.localStorage.setItem("bathroom", JSON.stringify(snapshot))
})

ReactDOM.render(<Bathroom bathroom={bathroom} />, document.getElementById("root"))

// const bathroom2 = BathroomModel.create({})
// ReactDOM.render(<Bathroom bathroom={bathroom2} />, document.getElementById("root2"))

// synchronizeActions([bathroom, bathroom2], ["restock", "flush"])
