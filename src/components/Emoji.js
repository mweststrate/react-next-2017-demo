import React from "react"

export const EmojiSpan = ({ emoji, size, className }) => (
    <span
        role="img"
        style={{ fontSize: (size || 10) + "em", display: "block" }}
        className={className}
    >
        {emoji}
    </span>
)

export const Emoji = {
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
    goal: createEmojiComponent("🎯"),
    game: createEmojiComponent("🎮")
}
function createEmojiComponent(emoji) {
    return props => <EmojiSpan emoji={emoji} {...props} />
}
