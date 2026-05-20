# A "conversation starter"

Known issues/what needs to be improved:
- ~~lambda is not tested on live AWS~~
- ~~deployment to AWS is not tested~~
- notifications query uses scan instead of query
- ~~no node_modules related optimizations (e.g. layer for lambda)~~
- no request validation
- no authorization

Design choices:
- no auto deploy when pushing to main (requires button)
- no frameworks etc
