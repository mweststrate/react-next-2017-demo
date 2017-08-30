import React from "react"
import { observer } from "mobx-react"

import { Stack } from "./Stack"
import { Pos } from "./Pos"
import { Emoji } from "./Emoji"

export const ToiletPaper = observer(({ bathroom }) => (
    <Stack amount={bathroom.amountOfToiletPaper}>
        {i => (
            <Pos top={300 + i * 100} left={300} key={i}>
                <Emoji.paper size={10} />
            </Pos>
        )}
    </Stack>
))
