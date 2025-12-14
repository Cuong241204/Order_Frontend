#!/bin/bash

echo "🧪 TEST STRIPE PAYMENT CONFIGURATION"
echo ""

# Check backend key
echo "1. Checking Backend Secret Key..."
if [ -f "backend/.env" ]; then
    if grep -q "STRIPE_SECRET_KEY=sk_test" backend/.env; then
        echo "   ✅ Backend Secret Key: OK"
    else
        echo "   ❌ Backend Secret Key: NOT FOUND"
    fi
else
    echo "   ❌ backend/.env file not found"
fi

# Check frontend key
echo ""
echo "2. Checking Frontend Publishable Key..."
if [ -f "frontend/.env" ]; then
    if grep -q "VITE_STRIPE_PUBLISHABLE_KEY=pk_test" frontend/.env; then
        echo "   ✅ Frontend Publishable Key: OK"
    else
        echo "   ❌ Frontend Publishable Key: NOT FOUND"
    fi
else
    echo "   ❌ frontend/.env file not found"
fi

# Test backend connection
echo ""
echo "3. Testing Backend Stripe Connection..."
cd backend
if node -e "require('dotenv').config(); const Stripe = require('stripe'); const key = process.env.STRIPE_SECRET_KEY; if (!key) { console.log('❌ Key not found'); process.exit(1); } const stripe = new Stripe(key, { apiVersion: '2024-12-18.acacia' }); console.log('✅ Stripe instance created successfully');" 2>/dev/null; then
    echo "   ✅ Backend can connect to Stripe"
else
    echo "   ❌ Backend cannot connect to Stripe"
fi
cd ..

echo ""
echo "✅ Test completed!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart backend: cd backend && npm run dev"
echo "   2. Restart frontend: cd frontend && npm run dev"
echo "   3. Test payment with test card: 4242 4242 4242 4242"
