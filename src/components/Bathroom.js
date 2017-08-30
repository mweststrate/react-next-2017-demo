import React from "react"
import { observer } from "mobx-react"

import "./Bathroom.css"

import { Emoji } from "./Emoji"
import { Painting } from "./Painting"
import { Pos } from "./Pos"
import { Buttons } from "./Buttons"
import { ToiletPaper } from "./ToiletPaper"
import { Toilet } from "./Toilet"

export const Bathroom = ({ bathroom }) => (
    <div className="Bathroom">
        <BathroomIcon />
        <FlushingIcon visible={bathroom.toilet.isFlushing} />
        <Painting painting={bathroom.painting} />
        <Buttons bathroom={bathroom} />
        <ToiletPaper bathroom={bathroom} />
        <Toilet toilet={bathroom.toilet} />
    </div>
)

const FlushingIcon = ({ visible }) =>
    visible ? (
        <Pos top={20} left={200}>
            <Emoji.flushing size={10} />
        </Pos>
    ) : null

const BathroomIcon = () => (
    <Pos top={20} left={30}>
        <Emoji.bathroom size={10} />
    </Pos>
)

export default observer(Bathroom)
