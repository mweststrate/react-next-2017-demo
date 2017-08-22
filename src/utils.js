import { reaction } from "mobx"

export function invariant(guard, message) {
    reaction(guard, guardResult => {
        if (!guardResult) throw new Error(message)
    })
}

export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
