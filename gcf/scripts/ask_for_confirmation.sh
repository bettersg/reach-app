head "src/config/index.ts" | sed -n '4 p'  # Print the firebase project name
echo "..."
echo ""
if [ "$SKIP_CONFIRMATION" != "Y" ]; then
  read -r -p "Press Enter to proceed, Ctrl+C to cancel. "
fi
