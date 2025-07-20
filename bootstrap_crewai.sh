#!/bin/bash

set -e

PROJECT_NAME="crewai"

# Colors for output
green='\033[0;32m'
red='\033[0;31m'
nc='\033[0m'

function info() {
  echo -e "${green}==> $1${nc}"
}
function error() {
  echo -e "${red}ERROR: $1${nc}" >&2
  exit 1
}

info "Checking for Wasp CLI..."
if ! command -v wasp &> /dev/null; then
  info "Wasp CLI not found. Installing..."
  curl -sSL https://get.wasp.sh/installer.sh | sh || error "Failed to install Wasp CLI."
  export PATH="$HOME/.wasp/bin:$PATH"
else
  info "Wasp CLI already installed."
fi

if [ -d "$PROJECT_NAME" ]; then
  info "Project directory '$PROJECT_NAME' already exists. Skipping scaffold."
else
  info "Scaffolding new Open SaaS project: $PROJECT_NAME"
  wasp new -t saas $PROJECT_NAME || error "Failed to scaffold project."
fi

# Detect correct app root (crewai/app or crewai)
if [ -d "$PROJECT_NAME/app" ]; then
  APP_DIR="$PROJECT_NAME/app"
else
  APP_DIR="$PROJECT_NAME"
fi
cd "$APP_DIR"

info "Setting up .env file with placeholders (Stripe, SendGrid, AWS S3, etc.)..."
cat > .env <<EOF
# --- SaaS Environment Variables ---
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/$PROJECT_NAME
STRIPE_SECRET_KEY=sk_test_yourkey
STRIPE_PUBLISHABLE_KEY=pk_test_yourkey
SENDGRID_API_KEY=SG.yourkey
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
# Add more as needed
EOF
info ".env file created/updated. Please update with your real credentials."

info "Starting local database (PostgreSQL via Docker, if not running)..."
wasp db start || error "Failed to start database."

info "Running initial database migrations..."
wasp db migrate-dev || error "Failed to run migrations."

if [ -f .env.server.example ]; then
  info "Copying .env.server.example to .env.server (if not already present)..."
  cp -n .env.server.example .env.server || true
fi

info "Starting the dev server... (Ctrl+C to stop)"
wasp start || error "Failed to start dev server."

cat <<NEXT

${green}🎉 CrewAI Open SaaS stack is running! Visit http://localhost:3000${nc}

${green}Next steps:${nc}
- Explore the codebase: cd $APP_DIR
- Integrate your FastAPI backend for CrewAI-specific logic (workflows, agents, execution, etc.)
- Customize the frontend (React + TailwindCSS) to match Lindy.AI’s style
- Connect the frontend to both backends (Wasp for SaaS features, FastAPI for CrewAI logic)
- Update .env with your real API keys and secrets
- (Optional) Add more environment variables as needed
- (Optional) Port CrewAI backend logic to Wasp/Node/TS for a single codebase

If you want this script to do even more (e.g., install Node.js, Docker, or Python, or set up FastAPI integration scaffolding), let me know!
NEXT 