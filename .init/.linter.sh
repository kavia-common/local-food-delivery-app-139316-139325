#!/bin/bash
cd /home/kavia/workspace/code-generation/local-food-delivery-app-139316-139325/food_delivery_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

