#!/bin/bash

echo "Running concurrently for all apps in the monorepo..."

#        concurrently -n "<desired name>,<another desired name>" \
#         -c "magenta,cyan" \
#         "pnpm --filter <app name> dev" \
#         "pnpm --filter <app name> dev"

#  available chalk colors:
#         Colors
# black
# red
# green
# yellow
# blue
# magenta
# cyan
# white
# blackBright (alias: gray, grey)
# redBright
# greenBright
# yellowBright
# blueBright
# magentaBright
# cyanBright
# whiteBright
#       Background colors
# bgBlack
# bgRed
# bgGreen
# bgYellow
# bgBlue
# bgMagenta
# bgCyan
# bgWhite
# bgBlackBright (alias: bgGray, bgGrey)
# bgRedBright
# bgGreenBright
# bgYellowBright
# bgBlueBright
# bgMagentaBright
# bgCyanBright
# bgWhiteBright