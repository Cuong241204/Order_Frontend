#!/bin/bash
echo "🔄 Stopping backend..."
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

echo "🚀 Starting backend..."
cd /Users/quynhlx/Documents/Order_Frontend/backend
node src/server.js &
sleep 3

echo ""
echo "✅ Backend restarted!"
echo "Testing Stripe config..."
sleep 2

# Test if Stripe is working
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test",
    "customerPhone": "0901234567", 
    "tableNumber": "1",
    "numberOfGuests": 2,
    "items": [{"id":1,"name":"Test","price":50000,"quantity":1}],
    "totalPrice": 50000,
    "paymentMethod": "card"
  }' 2>/dev/null | python3 -m json.tool

echo ""
echo "Check backend terminal for errors!"
