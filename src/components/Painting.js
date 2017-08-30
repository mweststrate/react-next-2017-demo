import React from "react"
import { observer } from "mobx-react"
import Draggable from "react-draggable"

import { EmojiSpan } from "./Emoji"

export const Painting = observer(({ painting }) => (
    <Draggable
        position={{ x: painting.anchor.x, y: painting.anchor.y }}
        onStop={(_, { x, y }) => painting.move(x, y)}
    >
        <div>
            <EmojiSpan size={30} emoji={painting.painting} />
        </div>
    </Draggable>
))
