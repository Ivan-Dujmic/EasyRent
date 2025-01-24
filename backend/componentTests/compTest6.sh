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
  'http://127.0.0.1:8000/api/auth/user-info/' \
  -H 'accept: application/json'
echo
curl -X 'POST' \
  'http://127.0.0.1:8000/api/auth/logout/' \
  -H 'accept: */*' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d ''
echo
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
  'http://127.0.0.1:8000/api/auth/user-info/' \
  -H 'accept: application/json'
curl -X 'POST' \
  'http://127.0.0.1:8000/api/auth/logout/' \
  -H 'accept: */*' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d ''
echo
curl -X 'GET' \
  'http://127.0.0.1:8000/api/auth/user-info/' \
  -H 'accept: application/json'
