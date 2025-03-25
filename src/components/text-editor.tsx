"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Button, Group, Stack, Text, Textarea, Title, Center, Paper, Container, Divider } from "@mantine/core"
import { ColorPalette } from "./color-palette"
import { UsageGuide } from "./usage-guide"

// Discord ANSI color codes
const FG_COLORS = {
  default: "\u001b[0m",
  gray: "\u001b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  pink: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
}

const BG_COLORS = {
  default: "",
  darkBlue: "\u001b[40m",
  orange: "\u001b[41m",
  grayGreen: "\u001b[42m",
  teal: "\u001b[43m",
  gray: "\u001b[44m",
  purple: "\u001b[45m",
  darkGray: "\u001b[46m",
  lightYellow: "\u001b[47m",
}

// Visual representation of colors for the UI
const FG_COLOR_VALUES = [
  "#5c5f66", // gray
  "#fa5252", // red
  "#82c91e", // green
  "#fcc419", // yellow
  "#339af0", // blue
  "#f06595", // pink
  "#22b8cf", // cyan
  "#ffffff", // white
]

const BG_COLOR_VALUES = [
  "#003366", // darkBlue
  "#ff5722", // orange
  "#607d8b", // grayGreen
  "#78909c", // teal
  "#90a4ae", // gray
  "#7986cb", // purple
  "#9e9e9e", // darkGray
  "#fff9c4", // lightYellow
]

// CSS color mapping for preview
const FG_CSS_COLORS = [
  "#5c5f66", // gray
  "#fa5252", // red
  "#82c91e", // green
  "#fcc419", // yellow
  "#339af0", // blue
  "#f06595", // pink
  "#22b8cf", // cyan
  "#ffffff", // white
]

const BG_CSS_COLORS = [
  "#003366", // darkBlue
  "#ff5722", // orange
  "#607d8b", // grayGreen
  "#78909c", // teal
  "#90a4ae", // gray
  "#7986cb", // purple
  "#9e9e9e", // darkGray
  "#fff9c4", // lightYellow
]

export function TextEditor() {
  const [rawText, setRawText] = useState(`Welcome to Rebane's Discord Colored Text Generator!`)
  const [formattedText, setFormattedText] = useState("")
  const [copied, setCopied] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>("")
  const [colorSections, setColorSections] = useState<Array<{
    start: number
    end: number
    fgColor?: string
    bgColor?: string
    bold?: boolean
    strike?: boolean
  }>>([])
  const [hasSelection, setHasSelection] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Track text selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        setHasSelection(start !== end)
      }
    }

    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('select', handleSelectionChange)
      return () => textarea.removeEventListener('select', handleSelectionChange)
    }
  }, [])

  // Update preview HTML whenever text or color sections change
  useEffect(() => {
    updatePreview()
  }, [rawText, colorSections])

  const updatePreview = () => {
    let ansiText = ""
    let htmlText = ""

    // Apply formatting in order
    const sortedSections = [...colorSections].sort((a, b) => a.start - b.start)

    let lastPos = 0
    for (const section of sortedSections) {
      // Add text before this section
      const beforeText = rawText.substring(lastPos, section.start)
      ansiText += beforeText
      htmlText += beforeText

      // Get the section text
      const sectionText = rawText.substring(section.start, section.end)

      // Build ANSI codes
      let ansiCodes = ""
      if (section.bold) ansiCodes += "\u001b[1m"
      if (section.strike) ansiCodes += "\u001b[9m"
      if (section.fgColor) ansiCodes += section.fgColor
      if (section.bgColor) ansiCodes += section.bgColor

      // Apply ANSI formatting
      ansiText += ansiCodes + sectionText + FG_COLORS.default

      // Build HTML formatting
      let htmlPrefix = ""
      let htmlSuffix = ""
      
      if (section.fgColor) {
        const fgKey = Object.keys(FG_COLORS).find(key => 
          FG_COLORS[key as keyof typeof FG_COLORS] === section.fgColor
        )
        if (fgKey) {
          const index = Object.keys(FG_COLORS).indexOf(fgKey) - 1
          const cssColor = FG_CSS_COLORS[index]
          htmlPrefix += `<span style="color: ${cssColor};">`
          htmlSuffix = "</span>" + htmlSuffix
        }
      }
      
      if (section.bgColor) {
        const bgKey = Object.keys(BG_COLORS).find(key => 
          BG_COLORS[key as keyof typeof BG_COLORS] === section.bgColor
        )
        if (bgKey) {
          const index = Object.keys(BG_COLORS).indexOf(bgKey) - 1
          const cssColor = BG_CSS_COLORS[index]
          htmlPrefix += `<span style="background-color: ${cssColor};">`
          htmlSuffix = "</span>" + htmlSuffix
        }
      }
      
      if (section.bold) {
        htmlPrefix += "<strong>"
        htmlSuffix = "</strong>" + htmlSuffix
      }
      
      if (section.strike) {
        htmlPrefix += "<del>"
        htmlSuffix = "</del>" + htmlSuffix
      }
      
      htmlText += htmlPrefix + sectionText + htmlSuffix

      lastPos = section.end
    }

    // Add remaining text after last section
    const afterText = rawText.substring(lastPos)
    ansiText += afterText
    htmlText += afterText

    setFormattedText(ansiText)
    setPreviewHtml(htmlText)
  }

  const applyColor = (color: string, isBackground: boolean = false) => {
    if (!textareaRef.current || !hasSelection) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end) return

    // Check if this selection matches an existing section
    const existingSectionIndex = colorSections.findIndex(
      section => section.start === start && section.end === end
    )

    if (existingSectionIndex >= 0) {
      // Update existing section
      const updatedSections = [...colorSections]
      if (isBackground) {
        updatedSections[existingSectionIndex] = { 
          ...updatedSections[existingSectionIndex], 
          bgColor: color 
        }
      } else {
        updatedSections[existingSectionIndex] = { 
          ...updatedSections[existingSectionIndex], 
          fgColor: color 
        }
      }
      setColorSections(updatedSections)
    } else {
      // Add new section
      setColorSections(prev => [
        ...prev,
        {
          start,
          end,
          [isBackground ? 'bgColor' : 'fgColor']: color
        }
      ])
    }
  }

  const applyForegroundColor = (color: string, colorIndex: number) => {
    const colorKeys = Object.keys(FG_COLORS)
    const colorKey = colorKeys[colorIndex + 1] // +1 because we skip 'default'
    if (colorKey) {
      applyColor(FG_COLORS[colorKey as keyof typeof FG_COLORS])
    }
  }

  const applyBackgroundColor = (color: string, colorIndex: number) => {
    const colorKeys = Object.keys(BG_COLORS)
    const colorKey = colorKeys[colorIndex + 1] // +1 because we skip 'default'
    if (colorKey) {
      applyColor(BG_COLORS[colorKey as keyof typeof BG_COLORS], true)
    }
  }

  const resetAll = () => {
    setRawText("Welcome to Rebane's Discord Colored Text Generator!")
    setColorSections([])
    setCopied(false)
  }

  const applyFormatting = (type: 'bold' | 'strike') => {
    if (!textareaRef.current || !hasSelection) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    if (start === end) return

    // Check if this selection matches an existing section
    const existingSectionIndex = colorSections.findIndex(
      section => section.start === start && section.end === end
    )

    if (existingSectionIndex >= 0) {
      // Toggle the formatting if section exists
      const updatedSections = [...colorSections]
      updatedSections[existingSectionIndex] = {
        ...updatedSections[existingSectionIndex],
        [type]: !updatedSections[existingSectionIndex][type]
      }
      setColorSections(updatedSections)
    } else {
      // Add new section with formatting
      setColorSections(prev => [
        ...prev,
        {
          start,
          end,
          [type]: true
        }
      ])
    }
  }

  const applyBold = () => applyFormatting('bold')
  const applyLine = () => applyFormatting('strike')

  const copyToClipboard = () => {
    const discordFormatted = "```ansi\n" + formattedText + "\n```"
    navigator.clipboard.writeText(discordFormatted)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Container size="md" py="xl" ta="center">
      <Stack gap="lg">
        <Center>
          <Title order={1}>
            Rebane&apos;s Discord{" "}
            <Text component="span" c="blue" size="lg">
              Colored
            </Text>{" "}
            Text Generator
          </Title>
        </Center>

        <Box>
          <Title order={2} mb="xs">
            About
          </Title>
          <Text ta="center">
            This is a simple app that creates colored Discord messages using the ANSI color codes available on the
            latest Discord desktop versions.
          </Text>
          <Text ta="center" mt="md">
            To use this, write your text, select parts of it and assign colors to them, then copy it using the button
            below, and send in a Discord message.
          </Text>
        </Box>

        <UsageGuide />

        <Box>
          <Title order={2} mb="xs">
            Source Code
          </Title>
          <Text ta="center">
            This app runs entirely in your browser and the source code is freely available on{" "}
            <Text component="span" c="blue" style={{ cursor: "pointer" }}>
              GitHub
            </Text>
            .
          </Text>
        </Box>

        <Divider />

        <Center>
          <Box>
            <Title order={2} mb="md">
              Create your text
            </Title>

            <Group mb="md">
              <Button variant="default" onClick={resetAll}>
                Reset All
              </Button>
              <Button variant="default" onClick={applyBold} disabled={!hasSelection}>
                Bold
              </Button>
              <Button variant="default" onClick={applyLine} disabled={!hasSelection}>
                Line
              </Button>
            </Group>

            <Stack gap="md">
              <ColorPalette 
                label="FG" 
                colors={FG_COLOR_VALUES} 
                onColorSelect={applyForegroundColor} 
                disabled={!hasSelection}
              />
              <ColorPalette
                label="BG"
                colors={BG_COLOR_VALUES}
                isBackground={true}
                onColorSelect={applyBackgroundColor}
                disabled={!hasSelection}
              />
            </Stack>

            <Paper withBorder mt="md" p="md" bg="dark.8" style={{ minHeight: 200 }}>
              <Textarea
                ref={textareaRef}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                minRows={8}
                autosize
                styles={{
                  input: {
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                    fontFamily: "monospace",
                  },
                }}
              />
            </Paper>

            <Title order={3} mt="lg" mb="sm">
              Preview
            </Title>
            <Paper
              withBorder
              p="md"
              bg="#36393f"
              style={{
                minHeight: 100,
                fontFamily: "monospace",
                color: "white",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </Paper>

            <Center mt="md">
              <Button onClick={copyToClipboard} size="md" color={copied ? "green" : "blue"}>
                {copied ? "Copied!" : "Copy text as Discord formatted"}
              </Button>
            </Center>
          </Box>
        </Center>
      </Stack>
    </Container>
  )
}