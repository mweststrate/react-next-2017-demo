import { types, process } from "mobx-state-tree"
import { when } from "mobx"
import { delay } from "../utils"

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 5,
        fullness: 0,
        isFlushing: false
    })
    .actions(self => {
        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.fullness = Math.max(0, self.fullness - 1)
            self.isFlushing = false
        })

        return {
            wipe() {
                if (self.amountOfToiletPaper <= 0) throw new Error("OutOfToiletPaperException")
                self.amountOfToiletPaper -= 1
            },
            dump() {
                if (self.fullness >= 2) throw new Error("ToiletOverflowException")
                self.fullness += 1
            },
            flush
        }
    })
