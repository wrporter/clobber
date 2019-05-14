const bird = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJFBMVEUAAAAIPGEynO1LtP+HNRQQdrcAAADUfAD/xk3vrExaGQD///8qJMamAAAAAXRSTlMAQObYZgAAAAFiS0dECx/XxMAAAAAHdElNRQfjBQ4RBiOd4iR8AAAAeklEQVQI12NgYGAQBAEgzahsbGysyMDi4uISlKaUwODe0dHpZKwkwOAxc+bMQlEgw3NGR0dHIYhR4uLiPhHEcAfJARlLVgHBUiCDgYEtNDQIzGBUUjQWApuspCoYpAhiBKmGBoUBGQxpQJAAYrCUsEwB0Qxcq7hWMQAArnIdm1hi3VAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDUtMTRUMTc6MDY6MzUrMDM6MDCabweyAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA1LTE0VDE3OjA2OjM1KzAzOjAw6zK/DgAAAABJRU5ErkJggg==";
const duck = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAT5JREFUOBGNU7tOxDAQnKD7A/IFJ9EAuoLoJOiJUIqroeAD6FICJ0p00NLzAXQUkbB49BQoDcqVtFThFzA3a9mKHRNYKdbuZGd2s+skCKy5gA4gbF8iCbFoTLK+L/T3B9zDOCbaE3g69Mk7t1+eCN/3SCtgrQvqieqGzv8NZ8KIh1V/mTMC8qMC9fpxvKRJcefoaprqvNxzwPKhwvOdwv7CQYOOdHBdvkpSNm6RlzN83lSDJDtUbkcETk53HYEdxIyf1WwoGeRWVoBzaQAt++VnWJJ0sUoeGpzN5cykAwJn86nFhZy890VimBMIKy5rhc2J0xQnhnn3wE8HWNFa1ydmY9dB2B4HxXXWi1Q0srGS+6FhLhu7ESEeHOLsoAVJ/zGSq8cU52+tWSMdgJtQf4p0ySzm/abddQ51YgqajB/xFpV4hFEPQgAAAABJRU5ErkJggg==";
const fish = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAbhJREFUOBGVUz0sQ1EYPa8xGJsSYa34CUkXPwuRCI0+P5tEEwwYJJZu0lglVTaTqe1gICFhQEVjERY/C4kU0ZUITUeT6577+r12IOokr9937z3nvO/r+64FDe9iWjH+F4U126oSUU9fCFPNQLhJdoDtp1IuWbYAXL8BF2fHZsuSg+reGTUQTeLlNS9bP8aGeh9O47P4PE8ZrYcstpBKJnEwAtzM+X4VygG50rbFJDIeMmXRgOhI5BHP1DgL/RsNfrg5E1bRWQes7x7DVCCno4dAJmwZ8WAMCIZtMJabCVeiMWj1wvQe2bRckXVrQwXShlduQjP+gdQYsIWtR6VOJqDUnq2+nnXUkCg51+QwrnTVGg21bgs3uVrzRk+jY8wKBJZfgQ9buk/JrhNdAy4p0m+Ayjlfl1Ee7A8jHrtCe0fJmBp3kHbmH4BYC6JLJUJ5FZMLaWSX9dfQnNX+TWxQreEacCEmzMeG3tE2A1NyLAFHXOT4SSjCGHA8c4+X8Dd3GxPmdwldiRYSR9NplIt4ng2EzJlpVoaJg1EJOHjk8jI5/5ZW0YQXqhJwDigm1zXggheK8S/IRSLvGwQByCeh5mgHAAAAAElFTkSuQmCC";
const frog = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAXNJREFUOBGVUjFIA0EQnAuPjUREhBSiYGOlKVLZW0S0sbIPBDsFQTuxkHQKAe2CYCeSykZMCutYpdCYQhDBxyIgilopj+/Nnfvehzfqwmf3Zmcmv/unoGN6JRMyS5zvdpTUbk7ieQQ3iu+Yn3o03JPLIZQQNxSTJJ7H5lz/E5Syf/pxAxqAZDdK+32JPGPQPgAoZLD+KZJ4MmtsB/ntMYxODsd8/NYD6ut3MUwflBqYyYaLax4qE83uZs/z0nUO1Z0AZgSK+Xpb5UxPkTQ3VzuoFJqoImsN6EbgqNARzq+ZGiCwPI6hq389Xxr7BrTh4iS4QC7NjW6sUbPdFJ0Oyz6W868GefbfsDByC2aK+LgYSeRSQ22KwPH9OJMht6/sIiUTl5qZhgzReC9nF0pvM/Rn07ppetHP9xiDEcZir55GoxaA2mgEd0ZebQYvjlwewWhKroxg5tDc6AvoKx0WT3NyNkbsE2PP5XIHcpUjohQ6/6n3CctUvwwyewsLAAAAAElFTkSuQmCC";
const owl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAAaFJREFUOBGNUzFIA0EQnFc7wSoQCyshjdoEsRYFiQS/SJNoIRZa2YhYCWIhgpWks9LKIiZNipfgp1BstBAJgloYtLIw8JVgGc+b/dzlo0GycH9zu7Nze3v3gLbsYFxxEPdiUf6ASdjdbAD53kTI3cvHJdUKeH4M6dSI0ft39vymjTsGsazkWBO1537jsoIV/936DKf01ZBcWwEZTM7UPrCYAM7qQDk5LIndfFaR4GAqph53oDjTtMvOUUxnlMtcW8F42tVLD0fFKxRelMyaTE6Hz00FINfzbyUmH56fFagbV1VzYSXc6fsVMog5GCOHXHOVfaZ5E/vAU8XD3IYL7kJzHlZkENPHGDnkspk0xwhwsX0XsB+EGNoq4Xp1SfD0SQGfh1nBUQ6bLgKMGEUSaGEvBcrHccIbNxuY66aX52kzNVpbaKCeucR6bkb8bGyiPIvj806efgsIZSMirGRyNMD9W8w+qm4+Jmtr1SX7SPf/JDH0W6x1TNncvgOq6XOp4um8yOWWL/QcNpTn7fTbytuAWbwRydafVolmyZjF5j+g4wejQ+UbF5mK2AAAAABJRU5ErkJggg==";

export { bird, duck, fish, frog, owl };
