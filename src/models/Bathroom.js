import { autorun } from "mobx"
import { types, process, addMiddleware } from "mobx-state-tree"

import { delay, atomicActions, undoRedoMiddleware } from "../utils"

const Anchor = types.model({
    x: types.number,
    y: types.number
})

const Sh_t = types.model({
    weight: 500,
    smell: 7
})

const Toilet = types.model({
    contents: types.array(Sh_t)
})

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
        painting: Painting,
        isFlushing: false
    })
    .views(self => ({
        get fullness() {
            return self.toilet.contents.length
        }
    }))
    .actions(self => {
        // addMiddleware(self, atomicActions)
        const undoManager = undoRedoMiddleware(self, ["movePainting"])

        autorun(() => {
            console.dir(self.painting.toJSON())
        })

        function wipe() {
            if (self.amountOfToiletPaper <= 0) throw new Error("OutOfToiletPaperException")
            self.amountOfToiletPaper -= 1
        }

        function restock() {
            self.amountOfToiletPaper += 3
        }

        function dump() {
            if (self.fullness >= 2) throw new Error("ToiletOverflowException")
            self.toilet.contents.push(Sh_t.create())
        }

        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.toilet.contents.clear()
            self.isFlushing = false
        })

        function takeA____() {
            self.dump()
            self.wipe()
            self.wipe()
            self.flush()
        }

        return {
            wipe,
            dump,
            flush,
            restock,
            takeA____,
            undo: undoManager.undo,
            redo: undoManager.redo
        }
    })
