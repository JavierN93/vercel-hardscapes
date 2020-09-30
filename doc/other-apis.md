## API Documentation

##### GET /api/status
* Check the connection status
* Returns the connection status
```
{
  "status": "boolean"
}
```

##### POST /api/contact
* Send contact us message
```
{
  "email": "email",
  "phone": "string",
  "fullName": "string",
  "message": "string",
  "address": "string",
  "latitude"?: "number",
  "longitdude"?: "number",
  "sourceFoundUs": "SourceFoundUs",
}
```
* Returns success state
```
{
  "success": "boolean"
}
```

##### POST /api/partner-request
* Send partner request message
```
{
  "email": "email",
  "phone": "string",
  "fullName": "string",
  "message": "string",
  "address": "string",
  "latitude"?: "number",
  "longitdude"?: "number",
  "sourceFoundUs": "SourceFoundUs",
}
```
* Returns success state
```
{
  "success": "boolean"
}
```
