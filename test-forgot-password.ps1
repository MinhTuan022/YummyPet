# Test Script for Forgot Password API

# 1. Forgot Password Request
# Replace test@example.com with an actual email address in your database
echo "Testing Forgot Password API..."
echo "------------------------------"
echo ""

echo "Sending forgot password request for test@example.com"
curl -X POST "http://localhost:8080/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\"}" \
  -v

echo ""
echo ""
echo "Check your server logs to find the reset token URL"
echo "Look for log entries from EmailService containing 'SENDING PASSWORD RESET EMAIL'"
echo ""

# Note: After getting the token from the logs, you can test the reset password endpoint
# Replace YOUR_TOKEN with the actual token from the logs
echo "To test reset password, use the following command (replace YOUR_TOKEN with the token from logs):"
echo "curl -X POST \"http://localhost:8080/api/auth/reset-password\" -H \"Content-Type: application/json\" -d \"{\\\"token\\\":\\\"YOUR_TOKEN\\\",\\\"password\\\":\\\"newpassword\\\",\\\"confirmPassword\\\":\\\"newpassword\\\"}\" -v"
