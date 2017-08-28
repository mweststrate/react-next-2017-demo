import React from "react"
import { observer } from "mobx-react"
import Draggable from "react-draggable"

import "./App.css"

const EmojiSpan = ({ emoji, size, className }) =>
    <span
        role="img"
        style={{ fontSize: (size || 10) + "em", display: "block" }}
        className={className}
    >
        {emoji}
    </span>

function createEmojiComponent(emoji) {
    return props => <EmojiSpan emoji={emoji} {...props} />
}

const Pos = ({ top, left, children }) =>
    <div style={{ position: "absolute", top, left }}>
        {children}
    </div>

const Emoji = {
    toilet: createEmojiComponent("🚽"),
    poop: createEmojiComponent("💩"),
    paper: createEmojiComponent("📃"),
    flushing: createEmojiComponent("💦"),
    pointer: createEmojiComponent("👇"),
    stench: createEmojiComponent("😷"),
    speak_no_evil: createEmojiComponent("🙊"),
    duck: createEmojiComponent("🦆"),
    party: createEmojiComponent("🎉"),
    painting: createEmojiComponent("🖼"),
    bathroom: createEmojiComponent("🚻"),
    nuclear: createEmojiComponent("☢"),
    rainbow: createEmojiComponent("🌈"),
    goal: createEmojiComponent("🎯")
}

const Painting = observer(({ painting }) =>
    <Draggable
        position={{ x: painting.anchor.x, y: painting.anchor.y }}
        onStop={(_, { x, y }) => painting.move(x, y)}
    >
        <div>
            <EmojiSpan size={30} emoji={painting.painting} />
        </div>
    </Draggable>
)

const Buttons = ({ bathroom }) =>
    <Pos top={20} left={540}>
        <button onClick={bathroom.dump}>Donate</button>
        <button onClick={bathroom.wipe}>Wipe</button>
        <button onClick={bathroom.flush}>Flush</button>
        <button onClick={bathroom.restock}>Restock</button>
        <button onClick={bathroom.takeA____}>Take a *</button>
        <button onClick={bathroom.undo}>undo</button>
        <button onClick={bathroom.redo}>redo</button>
    </Pos>

const FlushingIcon = ({ visible }) =>
    visible
        ? <Pos top={20} left={200}>
              <Emoji.flushing size={10} />
          </Pos>
        : null

const Toilet = observer(({ bathroom }) =>
    <div>
        {bathroom.fullness > 0
            ? <Stack amount={bathroom.fullness}>
                  {i =>
                      <Pos top={542 - i * 150} left={780} key={i}>
                          <Emoji.poop size={20} className={bathroom.isFlushing ? "spinning" : ""} />
                      </Pos>}
              </Stack>
            : <Pos top={540} left={783}>
                  <Emoji.duck size={18} className={bathroom.isFlushing ? "spinning" : "wobble"} />
              </Pos>}
        <Pos top={480} left={700}>
            <Emoji.toilet size={35} />
        </Pos>
        }
    </div>
)

const BathroomIcon = () =>
    <Pos top={20} left={30}>
        <Emoji.bathroom size={10} />
    </Pos>

const Bathroom = ({ bathroom }) =>
    <div className="Bathroom">
        <BathroomIcon />
        <FlushingIcon visible={bathroom.isFlushing} />
        <Painting painting={bathroom.painting} />
        <Buttons bathroom={bathroom} />
        <ToiletPaper bathroom={bathroom} />
        <Toilet bathroom={bathroom} />
    </div>

export default observer(Bathroom)

const ToiletPaper = observer(({ bathroom }) =>
    <Stack amount={bathroom.amountOfToiletPaper}>
        {i =>
            <Pos top={300 + i * 100} left={300} key={i}>
                <Emoji.paper size={10} />
            </Pos>}
    </Stack>
)

const Stack = observer(({ amount, children }) => {
    const items = []
    for (let i = 0; i < amount; i++) items.push(children(i))
    return (
        <div>
            {items}
        </div>
    )
})
