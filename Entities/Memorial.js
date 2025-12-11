// Memorial Entity Schema
// Stores information about deceased pets

export const MemorialSchema = {
  "name": "Memorial",
  "fields": {
    "pet_name": {
      "type": "string",
      "required": true
    },
    "species": {
      "type": "string",
      "required": true
    },
    "color_variant": {
      "type": "string",
      "default": "default"
    },
    "days_lived": {
      "type": "number",
      "default": 1
    },
    "stage_reached": {
      "type": "string",
      "default": "egg"
    },
    "achievements": {
      "type": "array",
      "default": []
    },
    "tricks_learned": {
      "type": "array",
      "default": []
    },
    "date_adopted": {
      "type": "string"
    },
    "date_passed": {
      "type": "string"
    },
    "epitaph": {
      "type": "string",
      "default": "Forever in our hearts"
    },
    "memorial_type": {
      "type": "string",
      "default": "basic"
    },
    "total_coins_earned": {
      "type": "number",
      "default": 0
    }
  }
};
