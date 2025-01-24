curl -c cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/auth/login/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d '{
  "email": "avantcar@example.com",
  "password": "username"
}'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/profile/company/earnings/?year=1' \
  -H 'accept: application/json'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/profile/company/earnings/?year=2000' \
  -H 'accept: application/json'
echo
curl -b cookies.txt -X 'GET' \
  'http://127.0.0.1:8000/api/profile/company/earnings/?year=-0.1' \
  -H 'accept: application/json'
