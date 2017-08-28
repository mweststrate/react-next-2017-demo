import { autorun } from "mobx"
import { types, process, addMiddleware } from "mobx-state-tree"

import { delay, atomicActions, undoRedoMiddleware } from "../utils"

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
        contents: types.array(types.union(Sh_t, Duck))
    })
    .actions(self => {
        function donate() {
            if (self.contents.length >= 2) throw new Error("ToiletOverflowException")
            if (Duck.is(self.contents[0])) self.contents.clear()
            self.contents.push(Sh_t.create({ type: "sh_t" }))
        }

        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.contents = [Duck.create({ type: "duck" })]
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
        // addMiddleware(self, atomicActions)
        const undoManager = undoRedoMiddleware(self, ["move"])

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
            takeA____,
            undo: undoManager.undo,
            redo: undoManager.redo
        }
    })
