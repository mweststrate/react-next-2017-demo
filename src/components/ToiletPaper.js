import React from "react"
import { observer } from "mobx-react"

import { Pos } from "./Pos"
import { Emoji } from "./Emoji"

export const ToiletPaper = observer(({ bathroom }) => {
    const items = []
    for (let i = 0; i < bathroom.amountOfToiletPaper; i++)
        items.push(
            <Pos top={300 + i * 100} left={300} key={i}>
                <Emoji.paper size={10} />
            </Pos>
        )

    return <div>{items}</div>
})
