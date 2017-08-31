import React from "react"

import { Pos } from "./Pos"

export const Buttons = ({ bathroom }) => (
    <Pos top={20} left={580}>
        <button onClick={bathroom.toilet.donate}>Donate</button>
        <button onClick={bathroom.wipe}>Wipe</button>
        <button onClick={bathroom.toilet.flush}>Flush</button>
        <button onClick={bathroom.restock}>Restock</button>
        <button
            onClick={() => {
                // MWE: this is an ugly because Firefox does not yet
                // support unhandled promise rejections, causing the nice react-error-overlay not to show up
                bathroom.takeA____().catch(e => {
                    setImmediate(() => {
                        throw e
                    })
                })
            }}
        >
            Full visit
        </button>
    </Pos>
)
