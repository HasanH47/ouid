# OUID (Optimized Unique Identifier)

![npm](https://img.shields.io/npm/v/ouid-h47)
![GitHub](https://img.shields.io/github/license/HasanH47/ouid)
![GitHub issues](https://img.shields.io/github/issues/HasanH47/ouid)

Node.js package to generate optimized unique IDs with timestamp and random component.

## Installation

Install the package using npm:

```bash
npm install ouid
```

## Usage
```javascript
const { ouid } = require('ouid-h47');

// Generate a new optimal ID
const newID = ouid();
console.log('Generated optimal ID:', newID);
```

## API

`ouid()`

Generates a new optimal ID composed of a timestamp and a random string.
- Returns: string - A unique ID with 26 characters (10 timestamp + 16 random).

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.