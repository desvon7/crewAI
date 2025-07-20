#!/bin/bash

# 1. Replace all Tailwind yellow-500/400/300/100/50 with orange-600/500/400/100/50 (closest match)
find crewai/app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" \) | \
  xargs sed -i '' \
    -e 's/yellow-500/orange-600/g' \
    -e 's/yellow-400/orange-500/g' \
    -e 's/yellow-300/orange-400/g' \
    -e 's/yellow-100/orange-100/g' \
    -e 's/yellow-50/orange-50/g'

# 2. Replace all #FFB300 with #FF6600
find crewai/app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" \) | \
  xargs sed -i '' 's/#FFB300/#FF6600/g'

# 3. Replace all lindyYellow with lindyOrange
find crewai/app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" \) | \
  xargs sed -i '' 's/lindyYellow/lindyOrange/g'

# 4. Update the gradient in tailwind config
sed -i '' "s/linear-gradient(90deg, #6C47FF 0%, #FFB300 100%)/linear-gradient(90deg, #6C47FF 0%, #FF6600 100%)/g" crewai/app/tailwind.config.cjs

# 5. Print success message
echo "✅ All yellow accents replaced with Y Combinator orange (#FF6600) and gradient updated!" 