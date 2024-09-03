curl -i "http://localhost:3000/users"

echo
echo
echo


curl \
  -silent \
  -i \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "age": 12, "email":"a@a.com"}' \
  "http://localhost:3000/users"