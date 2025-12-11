{
  "name": "Pet",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Pet's custom name"
    },
    "species": {
      "type": "string",
      "enum": [
        "dragon",
        "cerberus",
        "kitsune",
        "phoenix"
      ],
      "description": "Type of mythical pet"
    },
    "stage": {
      "type": "string",
      "enum": [
        "egg",
        "hatchling",
        "grown"
      ],
      "default": "egg",
      "description": "Evolution stage"
    },
    "hunger": {
      "type": "number",
      "default": 100,
      "description": "Hunger level 0-100"
    },
    "happiness": {
      "type": "number",
      "default": 100,
      "description": "Happiness level 0-100"
    },
    "energy": {
      "type": "number",
      "default": 100,
      "description": "Energy level 0-100"
    },
    "hygiene": {
      "type": "number",
      "default": 100,
      "description": "Cleanliness level 0-100"
    },
    "health": {
      "type": "number",
      "default": 100,
      "description": "Health level 0-100"
    },
    "experience": {
      "type": "number",
      "default": 0,
      "description": "Total experience points"
    },
    "coins": {
      "type": "number",
      "default": 50,
      "description": "In-game currency"
    },
    "has_insurance": {
      "type": "boolean",
      "default": false,
      "description": "Pet insurance active"
    },
    "last_fed": {
      "type": "string",
      "format": "date-time",
      "description": "Last daily update check"
    },
    "last_played": {
      "type": "string",
      "format": "date-time",
      "description": "Last play time"
    },
    "achievements": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [],
      "description": "Unlocked achievements"
    },
    "color_variant": {
      "type": "string",
      "default": "default",
      "description": "Pet color customization"
    },
    "days_alive": {
      "type": "number",
      "default": 0,
      "description": "Days since adoption"
    }
  },
  "required": [
    "name",
    "species"
  ]
}