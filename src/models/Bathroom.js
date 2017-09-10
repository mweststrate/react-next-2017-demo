/* eslint-disable */
import { types, process, addMiddleware, destroy, decorate } from "mobx-state-tree"

import { delay } from "../utils"

import {
    atomic,
    atomicAsync,
    undoRedoMiddleware,
    atomicAsyncAction,
    atomicAsyncPatch
} from "../middleware"
/* eslint-enable */

import { Toilet } from "./Toilet"
import { Painting } from "./Painting"

export const Bathroom = types
    .model("Bathroom", {
        amountOfToiletPaper: 0,
        isRelaxing: false,
        toilet: Toilet,
        painting: Painting
    })
    .actions(self => {
        function wipe() {
            if (self.amountOfToiletPaper <= 0) throw new Error("OutOfToiletPaperException")
            self.amountOfToiletPaper -= 1
        }

        function restock() {
            self.amountOfToiletPaper += 3
        }

        // function fullVisit() {
        //     self.toilet.donate()
        //     self.wipe()
        //     self.wipe()
        //     self.toilet.flush()
        // }

        const fullVisit = process(function* fullVisit() {
            yield delay(1000)
            self.toilet.donate()
            yield delay(1000)
            self.isRelaxing = true
            yield delay(1000)
            self.isRelaxing = false
            yield delay(1000)
            self.wipe()
            yield delay(1000)
            self.wipe()
            yield self.toilet.flush()
        })

        // addMiddleware(self, atomicAsyncAction)

        return {
            wipe,
            restock,
            // fullVisit
            fullVisit: decorate(atomicAsyncPatch, fullVisit)
        }
    })