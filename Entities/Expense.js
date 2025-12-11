{
  "name": "Expense",
  "type": "object",
  "properties": {
    "pet_id": {
      "type": "string",
      "description": "ID of the pet this expense belongs to"
    },
    "type": {
      "type": "string",
      "description": "Type of expense (feed, play, clean, health, insurance)"
    },
    "amount": {
      "type": "number",
      "description": "Amount spent in coins"
    },
    "description": {
      "type": "string",
      "description": "Description of the expense"
    }
  },
  "required": [
    "pet_id",
    "type",
    "amount"
  ]
}