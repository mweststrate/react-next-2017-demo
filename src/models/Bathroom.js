import { types, process } from "mobx-state-tree"
import { when } from "mobx"
import { delay } from "../utils"

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 3,
        fullness: 0,
        isFlushing: false
    })
    .actions(self => {
        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.fullness = 0
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
