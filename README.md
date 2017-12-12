# file-search-cli
CLI module for file search

Implement file search algorithm
--DIR (required) base lookup directory
--TYPE (optional) [D|F] D - directory, F - file
--PATTERN (options) regular expression to test file/directory name
--MIN-SIZE (options) minimum file size [B|K|M|G],  skipped for directories
--MAX-SIZE (options) maximum file size [B|K|M|G],  skipped for directories
(B - bytes, K - kilobytes, M - megabytes, G = gigabytes)

Parameters order is not strict. 

Examples:
    file-search-cli --DIR="/Users/john/Downloads" --PATTERN=\.js
    file-search-cli --DIR="/Users/john/Downloads" --TYPE=D
    file-search-cli --PATTERN=\.mkv --TYPE=F --MIN-SIZE=4G --DIR="/Users/john/Downloads"

Licence type MIT for more ditails read LICENSE

