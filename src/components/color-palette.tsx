"use client"

import { Group, Text, Tooltip, UnstyledButton, useMantineTheme } from "@mantine/core"

// Color name mapping for tooltips
const FG_COLOR_NAMES = ["Gray", "Red", "Green", "Yellow", "Blue", "Pink", "Cyan", "White"]
const BG_COLOR_NAMES = ["Dark Blue", "Orange", "Gray Green", "Teal", "Gray", "Purple", "Dark Gray", "Light Yellow"]

interface ColorPaletteProps {
  label: string
  colors: string[]
  isBackground?: boolean
  onColorSelect: (color: string, index: number) => void
  disabled?: boolean
}

export function ColorPalette({ label, colors, isBackground = false, onColorSelect }: ColorPaletteProps) {
  const theme = useMantineTheme()
  const colorNames = isBackground ? BG_COLOR_NAMES : FG_COLOR_NAMES

  return (
    <Group align="center" gap="xs">
      <Text fw={700} size="sm" w={40}>
        {label}
      </Text>
      {colors.map((color, index) => (
        <Tooltip key={color} label={colorNames[index]} position="top" withArrow>
          <UnstyledButton
            onClick={() => onColorSelect(color, index)}
            style={{
              width: 30,
              height: 30,
              backgroundColor: color,
              border: `1px solid ${theme.colors.dark[3]}`,
              borderRadius: theme.radius.sm,
            }}
          />
        </Tooltip>
      ))}
    </Group>
  )
}

