import { types, process, destroy } from "mobx-state-tree"
import { delay } from "../utils"

const Sh_t = types.model({
    type: types.literal("💩"),
    weight: 365,
    smell: 7
})

const Duck = types.model({
    type: types.literal("🦆"),
    name: "Donald"
})

export const Toilet = types
    .model({
        isFlushing: false,
        pile: types.array(types.union(Sh_t, Duck)),
        processed: 0
    })
    .actions(self => {
        function weightOfPile() {
            return self.pile.filter(x => Sh_t.is(x)).reduce((sum, p) => sum + p.weight, 0)
        }

        function donate() {
            if (Duck.is(self.pile[0])) destroy(self.pile[0])
            self.pile.push({ type: "💩" })
            if (self.pile.length > 2) throw new Error("ToiletOverflowException")
        }

        const flush = process(function* flush() {
            if (self.isFlushing) return
            self.isFlushing = true
            yield delay(2000)
            self.processed += weightOfPile()
            self.pile = [{ type: "🦆" }]
            self.isFlushing = false
        })

        return {
            donate,
            flush
        }
    })
