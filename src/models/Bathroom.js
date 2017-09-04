/* eslint-disable */
import { types, process, addMiddleware, destroy, decorate } from "mobx-state-tree"

import {
    delay,
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
        toilet: Toilet,
        painting: Painting
    })
    .actions(self => {
        // addMiddleware(self, atomicAsyncAction)

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

        // const takeA____ = process(function*() {
        //     self.toilet.donate()
        //     self.wipe()
        //     self.wipe()
        //     yield self.toilet.flush()
        //     self.wipe()
        //     self.wipe()
        // })

        return {
            wipe,
            restock,
            takeA____
            // takeA____: decorate(atomicAsyncPatch, takeA____)
        }
    })
