import { autorun } from "mobx"
import { types, process, addMiddleware, destroy, decorate } from "mobx-state-tree"

import { delay, atomic, undoRedoMiddleware } from "../utils"

const Sh_t = types.model({
    type: types.literal("sh_t"),
    weight: 500,
    smell: 7
})

const Duck = types.model({
    type: types.literal("duck"),
    name: "Donald"
})

const Toilet = types
    .model({
        isFlushing: false,
        pile: types.array(types.union(Sh_t, Duck))
    })
    .actions(self => {
        function donate() {
            if (self.pile.length >= 2) throw new Error("ToiletOverflowException")
            if (Duck.is(self.pile[0])) destroy(self.pile[0])
            self.pile.push({ type: "sh_t" })
        }

        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.pile = [{ type: "duck" }]
            self.isFlushing = false
        })

        return {
            donate,
            flush
        }
    })

const Anchor = types.model({ x: types.number, y: types.number })

const Painting = types
    .model({
        painting: "🖼",
        anchor: types.optional(Anchor, { x: 1400, y: 30 })
    })
    .actions(self => ({
        move(x, y) {
            this.anchor = { x, y }
        }
    }))

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 0,
        toilet: Toilet,
        painting: Painting
    })
    .actions(self => {
        // // addMiddleware(self, atomicActions)
        // const undoManager = undoRedoMiddleware(self, ["move"])

        function wipe() {
            if (self.amountOfToiletPaper <= 0) throw new Error("OutOfToiletPaperException")
            self.amountOfToiletPaper -= 1
        }

        function restock() {
            self.amountOfToiletPaper += 3
        }

        function takeA____() {
            self.toilet.donate()
            self.wipe()
            self.wipe()
            self.toilet.flush()
        }

        return {
            wipe,
            restock,
            // takeA____
            takeA____: decorate(atomic, takeA____)
            // undo: undoManager.undo,
            // redo: undoManager.redo
        }
    })
