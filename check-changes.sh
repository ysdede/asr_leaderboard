#!/bin/bash
echo "=== Checking for UI fixes ==="
echo "1. Viewport fix (should NOT have user-scalable=no):"
grep "viewport" index.html

echo -e "\n2. Body text color fix (should have text-gray-900 dark:text-gray-100):"
grep "body class" index.html

echo -e "\n3. Background color fix (should have dark:bg-gray-900):"
grep -c "dark:bg-gray-900" src/components/*.jsx

echo -e "\n4. Mobile responsive classes (should have hidden sm:table-cell):"
grep -c "hidden sm:table-cell" src/components/*.jsx

echo -e "\n5. Current branch and commit:"
git branch --show-current
git log --oneline -1
