import React from "react"

import { Pos } from "./Pos"

export const Buttons = ({ bathroom }) => (
    <Pos top={20} left={580}>
        <button onClick={bathroom.toilet.donate}>Donate</button>
        <button onClick={bathroom.wipe}>Wipe</button>
        <button onClick={bathroom.toilet.flush}>Flush</button>
        <button onClick={bathroom.restock}>Restock</button>
        <button onClick={bathroom.takeA____}>Full visit</button>
    </Pos>
)
