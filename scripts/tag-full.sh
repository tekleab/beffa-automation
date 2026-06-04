#!/usr/bin/env bash
# Add @full tag to test.describe calls in all *.spec.ts files
# Linux compatible sed syntax
find tests -type f -name "*.spec.ts" -exec sed -i -E "s/(test\.describe\([^)]*)\)/\1 @full)/" {} +

echo "Added @full tag to test.describe lines where missing"
