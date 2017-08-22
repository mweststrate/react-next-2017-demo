import { types, process } from "mobx-state-tree"
import { delay } from "../utils"

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 3,
        fullness: 0,
        isFlushing: false
    })
    .actions(self => {
        function wipe() {
            if (self.amountOfToiletPaper <= 0) throw new Error("OutOfToiletPaperException")
            self.amountOfToiletPaper -= 1
        }

        function restock() {
            self.amountOfToiletPaper += 5
        }

        function dump() {
            if (self.fullness >= 2) throw new Error("ToiletOverflowError")
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
            takeA____
        }
    })
