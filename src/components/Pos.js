import React from "react"

export const Pos = ({ top, left, children }) => (
    <div style={{ position: "absolute", top, left }}>{children}</div>
)
