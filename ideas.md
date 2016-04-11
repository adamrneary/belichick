steps:
 - [x] react firebase working example
 - [x] POST user and get/handle variant
 - [ ] actions to POSTs, updating aggregations



# TODO app
  - GETs only via firebase bindings
  - POSTs only via events to lambda

on mount:
  - display loading state
  - create a user & make a request to lambda for trial outcome

css for the three variants:
  - default todoMVC
  - solarized light
  - solarized dark

once you have an app variant, display todo interface
render app variant based on outcome
log todos

# firebase

basic firebase connection should do here i would think.
store todos by user
store aggregations of experiment results

# lambda

POST /users (returns a variant)
POST /todoEvents
  /create
  /:id/update
  /:id/destroy

# experiment interface

- slider to set the current rate of new variants (direct bind)
- odometer of todos created
- stacked area chart showing the volume of users added over time
- number of todos created per variant
- number of todos completed per variant
- todo complete rate per variant

# test harness fire ants
- load test this sucker with nightmare
