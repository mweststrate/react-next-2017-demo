import React from "react"
import { observer } from "mobx-react"

export const Stack = observer(({ amount, children }) => {
    const items = []
    for (let i = 0; i < amount; i++) items.push(children(i))
    return <div>{items}</div>
})
