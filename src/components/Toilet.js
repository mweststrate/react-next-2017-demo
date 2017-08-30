import React from "react"
import { observer } from "mobx-react"

import { Pos } from "./Pos"
import { Emoji } from "./Emoji"

export const Toilet = observer(({ toilet }) => (
    <div>
        {toilet.pile.map((item, i) => (
            <Pos top={542 - i * 150} left={780} key={i}>
                {item.type === "🦆" ? (
                    <Duck flushing={toilet.isFlushing} />
                ) : (
                    <Sh_t flushing={toilet.isFlushing} />
                )}
            </Pos>
        ))}
        <Pos top={480} left={700}>
            <Emoji.toilet size={35} />
        </Pos>
        }
    </div>
))

// eslint-disable-next-line
const Sh_t = ({ flushing }) => <Emoji.poop size={20} className={flushing ? "spinning" : ""} />

const Duck = ({ flushing }) => <Emoji.duck size={18} className={flushing ? "spinning" : "wobble"} />
