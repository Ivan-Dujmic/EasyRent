curl -X 'POST' \
  'http://127.0.0.1:8000/api/auth/login/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d '{
  "email": "ava@example.com",
  "password": "username"
}'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/home/best-value/?limit=1&page=1' \
  -H 'accept: application/json'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/home/best-value/?limit=4&page=2' \
  -H 'accept: application/json'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/home/best-value/?limit=0&page=0' \
  -H 'accept: application/json'
