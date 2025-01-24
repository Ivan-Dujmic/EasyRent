curl -c cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/auth/login/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d '{
  "email": "ava@example.com",
  "password": "username"
}'
echo
curl -b cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/wallet/buyGems' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 5000
}'
echo
curl -b cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/wallet/buyGems' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": 2
}'
echo
curl -b cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/wallet/buyGems' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "amount": "test"
}'
