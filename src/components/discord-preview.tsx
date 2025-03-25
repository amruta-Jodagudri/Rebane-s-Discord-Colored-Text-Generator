"use client"

import { Paper, useMantineTheme } from "@mantine/core"

interface DiscordPreviewProps {
  text: string
}

export function DiscordPreview({ text }: DiscordPreviewProps) {
  const theme = useMantineTheme()

  // This is a simplified preview - in a real app, you'd need to parse ANSI codes
  // and convert them to CSS styles for an accurate preview

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

