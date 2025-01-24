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
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/wallet/checkTransaction/5' \
  -H 'accept: */*'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/wallet/checkTransaction/30' \
  -H 'accept: */*'
#curl -b cookies.txt -X 'GET' \
#  'http://127.0.0.1:8000/api/wallet/checkTransaction/test' \
#  -H 'accept: */*'
