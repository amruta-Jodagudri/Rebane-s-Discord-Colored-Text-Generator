"use client"

import { Paper } from "@mantine/core"

interface DiscordPreviewProps {
  text: string
}

export function DiscordPreview({ text }: DiscordPreviewProps) {
  return (
    <Paper
      withBorder
      p="md"
      style={{
        backgroundColor: "#36393f", // Discord chat background color
        color: "white",
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {text}
    </Paper>
  )
}

