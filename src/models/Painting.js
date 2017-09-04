import { types } from "mobx-state-tree"

const Anchor = types.model({ x: types.number, y: types.number })

export const Painting = types
    .model({
        painting: "🖼",
        anchor: types.optional(Anchor, { x: 1400, y: 30 })
    })
    .actions(self => ({
        move(x, y) {
            self.anchor = { x, y }
        }
    }))
