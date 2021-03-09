# Genetec Challenge 2021

## Observations

- Approx. 9-10 new license plates per minute (from the bus)
  - Gives 540 license plates per hour
- At 10:30am tuesday, 35 wanted plates
- At 12:25pm tuesday, 37 wanted plates
- Approx. 1 new wanted plate per hour

## Facts

- Get request for new wanted plates cost -$30
- Successful post request gains us +$49
- 26 characters in the alphabet
- 10 digits
- License plate has 6 characters (3numbers3letters, F-plate, L-plate, 1letter2number3letter)
- License plates permutations possibilities: 71,033,600

## Assumptions

- Start (5pm) with a fixed number of wanted plates (35)
- On each new plate, 0.000000493 probability of hitting
- Assume we end the day with wanted plates, 0.000000563 probability

## Things to consider

- Ignore new wanted plate updates at the beginning and only make 1 get request near the middle
- Skip every second new wanted plate updates
- Ignore new wanted plate updates near the end
