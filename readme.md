## ChatApp

curl -X POST -H "Authorization: key={{key on google console}}" -H "Cache-Control: no-cache" -H "Postman-Token: c07084f8-2781-6403-d628-10b359d5dc1e" -H "Content-Type: application/x-www-form-urlencoded" -d 'registration_id={{registration_id in subscription_notification}}&sender_id={{google project id}}' 'https://android.googleapis.com/gcm/send'