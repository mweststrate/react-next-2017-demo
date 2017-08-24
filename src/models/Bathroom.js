import { autorun } from "mobx"
import { types, process, addMiddleware } from "mobx-state-tree"

import { delay, atomicActions, undoRedoMiddleware } from "../utils"

const Point = types.model({
    x: types.number,
    y: types.number
})

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 3,
        fullness: 0,
        isFlushing: false,
        painting: types.optional(Point, { x: 1400, y: 30 })
    })
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
            self.fullness += 1
        }

        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.fullness = 0
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
            movePainting(x, y) {
                self.painting = { x, y }
            },
            undo: undoManager.undo,
            redo: undoManager.redo
        }
    })
