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
curl -c cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/auth/login/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d '{
  "email": "ava@example.com",
  "password": "kriva_lozinka"
}'
echo
curl -c cookies.txt -X 'POST' \
  'http://127.0.0.1:8000/api/auth/login/' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRFTOKEN: hhKaawXLgZ97xlgYRcPhG1TH3SMuP5beiwAQtrQTUOPhjEENOu1XbsWobOOmssZu' \
  -d '{
  "email": "ava@example.com.com",
  "password": "kriva_lozinka"
}'
