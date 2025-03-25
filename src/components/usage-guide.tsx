"use client"

import { Box, List, Text, Title } from "@mantine/core"

export function UsageGuide() {
  return (
    <Box>
      <Title order={3} mb="sm">
        How to Use
      </Title>
      <List>
        <List.Item>
          <Text>Type your text in the editor below</Text>
        </List.Item>
        <List.Item>
          <Text>Select a portion of text you want to color</Text>
        </List.Item>
        <List.Item>
          <Text>Click on a foreground (FG) or background (BG) color to apply it</Text>
        </List.Item>
        <List.Item>
          <Text>Use <strong>Bold</strong> and <em>Line</em> buttons to add formatting</Text>
        </List.Item>
        <List.Item>
          <Text>Check the preview to see how it will look</Text>
        </List.Item>
        <List.Item>
          <Text>{`Click <em>"Copy text as Discord formatted"</em> when you're done`}</Text>
        </List.Item>
        <List.Item>
          <Text>Paste the copied text into Discord</Text>
        </List.Item>
      </List>
    </Box>
  )
}