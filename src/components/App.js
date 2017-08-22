import React, { Component } from "react"
import { observer } from "mobx-react"

import "./App.css"

function createEmojiComponent(emoji) {
    return ({ size }) =>
        <span role="img" style={{ fontSize: (size || 10) + "em" }}>
            {emoji}
        </span>
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

class App extends Component {
    render() {
        const bathroom = this.props.bathroom
        return (
            <div className="App">
                <Pos top={20} left={30}>
                    <Emoji.bathroom size={10} />
                </Pos>
                {bathroom.isFlushing &&
                    <Pos top={20} left={200}>
                        <Emoji.flushing size={10} />
                    </Pos>}
                <Pos top={30} left={1400}>
                    <Emoji.painting size={30} />
                </Pos>
                <Pos top={20} left={660}>
                    <button onClick={bathroom.dump}>Dump</button>
                    <button onClick={bathroom.wipe}>Wipe</button>
                    <button onClick={bathroom.flush}>Flush</button>
                </Pos>
                <ToiletPaper amount={bathroom.amountOfToiletPaper} />
                {bathroom.fullness > 0
                    ? <Poop amount={bathroom.fullness} />
                    : <Pos top={540} left={783}>
                          <Emoji.duck size={18} />
                      </Pos>}
                <Pos top={480} left={700}>
                    <Emoji.toilet size={35} />
                </Pos>
            </div>
        )
    }
}

const ToiletPaper = ({ amount }) =>
    <Stack amount={amount}>
        {i =>
            <Pos top={300 + i * 100} left={300} key={i}>
                <Emoji.paper size={10} />
            </Pos>}
    </Stack>

const Poop = ({ amount }) =>
    <Stack amount={amount}>
        {i =>
            <Pos top={542 - i * 150} left={780} key={i}>
                <Emoji.poop size={20} />
            </Pos>}
    </Stack>

const Stack = ({ amount, children }) => {
    const items = []
    for (let i = 0; i < amount; i++) items.push(children(i))
    return (
        <div>
            {items}
        </div>
    )
}

export default observer(App)
